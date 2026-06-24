// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title QurbanRegistry
 * @notice Smart contract pengelolaan qurban: registrasi peserta,
 *         pencatatan pembayaran, validasi, dan tracking status.
 *         Dana disimpan di kontrak (escrow) dan ditarik oleh panitia.
 */
contract QurbanRegistry {
    enum Status { Pending, Active, Paid, Cancelled, Slaughtered, Distributed }
    enum AnimalType { Sapi, Kambing, Domba }

    struct Animal {
        uint256 id;
        string  code;
        AnimalType animalType;
        uint8   maxSlots;
        uint8   takenSlots;
        uint256 pricePerSlot;   // wei
        bool    exists;
    }

    struct Participant {
        uint256 id;
        address wallet;
        uint256 animalId;
        uint8   slotNumber;
        uint256 totalAmount;    // wei
        uint256 paidAmount;     // wei akumulasi
        Status  status;
        uint64  registeredAt;
    }

    struct Payment {
        uint256 participantId;
        uint256 amount;
        uint64  paidAt;
        bytes32 receiptHash;    // keccak256(participantId,amount,timestamp)
    }

    address public owner;                                      // panitia
    uint256 public nextAnimalId = 1;
    uint256 public nextParticipantId = 1;
    uint256 public totalCollected;

    mapping(uint256 => Animal)      public animals;
    mapping(uint256 => Participant) public participants;
    mapping(uint256 => Payment[])   public paymentsOf;          // participantId => payments
    mapping(address => uint256[])   public participantsOf;      // wallet => ids

    event AnimalRegistered(uint256 indexed id, string code, AnimalType t, uint8 maxSlots, uint256 pricePerSlot);
    event ParticipantRegistered(uint256 indexed id, address indexed wallet, uint256 indexed animalId, uint8 slot, uint256 totalAmount);
    event PaymentRecorded(uint256 indexed participantId, address indexed payer, uint256 amount, bytes32 receiptHash);
    event PaymentValidated(uint256 indexed participantId, Status newStatus);
    event AnimalStatusUpdated(uint256 indexed animalId, Status status);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor() { owner = msg.sender; }

    // ---------- ANIMAL MANAGEMENT ----------
    function registerAnimal(string calldata code, AnimalType t, uint8 maxSlots, uint256 pricePerSlot)
        external onlyOwner returns (uint256 id)
    {
        require(maxSlots > 0, "maxSlots>0");
        require(pricePerSlot > 0, "price>0");
        id = nextAnimalId++;
        animals[id] = Animal(id, code, t, maxSlots, 0, pricePerSlot, true);
        emit AnimalRegistered(id, code, t, maxSlots, pricePerSlot);
    }

    // ---------- PARTICIPANT REGISTRATION ----------
    /// Peserta mendaftar dan langsung membayar (lunas atau cicilan pertama).
    function registerParticipant(uint256 animalId) external payable returns (uint256 pid) {
        Animal storage a = animals[animalId];
        require(a.exists, "Animal not found");
        require(a.takenSlots < a.maxSlots, "Slot full");
        require(msg.value > 0, "Payment required");
        require(msg.value <= a.pricePerSlot, "Overpay");

        a.takenSlots += 1;
        pid = nextParticipantId++;
        participants[pid] = Participant({
            id: pid,
            wallet: msg.sender,
            animalId: animalId,
            slotNumber: a.takenSlots,
            totalAmount: a.pricePerSlot,
            paidAmount: 0,
            status: Status.Active,
            registeredAt: uint64(block.timestamp)
        });
        participantsOf[msg.sender].push(pid);
        emit ParticipantRegistered(pid, msg.sender, animalId, a.takenSlots, a.pricePerSlot);

        _recordPayment(pid, msg.value);
    }

    /// Pembayaran lanjutan (cicilan).
    function payInstallment(uint256 pid) external payable {
        Participant storage p = participants[pid];
        require(p.id != 0, "Not found");
        require(p.status == Status.Active, "Not active");
        require(msg.value > 0, "Amount>0");
        require(p.paidAmount + msg.value <= p.totalAmount, "Overpay");
        _recordPayment(pid, msg.value);
    }

    function _recordPayment(uint256 pid, uint256 amount) internal {
        Participant storage p = participants[pid];
        p.paidAmount += amount;
        totalCollected += amount;

        bytes32 receipt = keccak256(abi.encodePacked(pid, amount, block.timestamp, msg.sender));
        paymentsOf[pid].push(Payment(pid, amount, uint64(block.timestamp), receipt));
        emit PaymentRecorded(pid, msg.sender, amount, receipt);

        if (p.paidAmount >= p.totalAmount) {
            p.status = Status.Paid;
            emit PaymentValidated(pid, Status.Paid);
        }
    }

    // ---------- VALIDATION & STATUS ----------
    function validatePayment(uint256 pid) external view returns (bool fullyPaid, uint256 paid, uint256 total) {
        Participant storage p = participants[pid];
        require(p.id != 0, "Not found");
        return (p.paidAmount >= p.totalAmount, p.paidAmount, p.totalAmount);
    }

    function setAnimalStatus(uint256 animalId, Status s) external onlyOwner {
        require(animals[animalId].exists, "Not found");
        // propagate ke seluruh peserta hewan tsb (cheap karena slot ≤ 7)
        for (uint256 i = 1; i < nextParticipantId; i++) {
            if (participants[i].animalId == animalId && participants[i].status == Status.Paid) {
                participants[i].status = s;
            }
        }
        emit AnimalStatusUpdated(animalId, s);
    }

    // ---------- VIEWS ----------
    function getPayments(uint256 pid) external view returns (Payment[] memory) {
        return paymentsOf[pid];
    }
    function getMyParticipants() external view returns (uint256[] memory) {
        return participantsOf[msg.sender];
    }

    // ---------- TREASURY ----------
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Transfer failed");
        emit Withdrawn(to, amount);
    }

    receive() external payable { totalCollected += msg.value; }
}
