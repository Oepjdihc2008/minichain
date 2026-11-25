export interface TestSuiteRecord {
  id: string;
  module: string;
  file: string;
  plane: "EVM / Foundry" | "Python Consensus Lab" | "Core PoW" | "Disaster Recovery";
  passed: number;
  total: number;
  fuzzRuns?: number;
  highlightsEn: string;
  highlightsZh: string;
}

export const VERIFIED_TEST_SUITES: TestSuiteRecord[] = [
  {
    id: "mnc-unit",
    module: "MNCTest (ERC-20)",
    file: "contracts/test/MNC.t.sol",
    plane: "EVM / Foundry",
    passed: 7,
    total: 7,
    highlightsEn: "Supply cap (1M MNC), initial balance, transfer, zero-address revert, insufficient balance revert, approve, transferFrom.",
    highlightsZh: "总供应量上限 (1,000,000 MNC)、初始余额、转账、零地址拦截、余额不足回滚、授权与代扣转账。",
  },
  {
    id: "mnc-fuzz",
    module: "MNCFuzzTest (Property & Fuzz)",
    file: "contracts/test/MNCFuzz.t.sol",
    plane: "EVM / Foundry",
    passed: 5,
    total: 5,
    fuzzRuns: 30000,
    highlightsEn: "30,000 randomized runs across supply conservation, self-transfer invariance, and allowance exhaustion + unauthorized/zero transfers.",
    highlightsZh: "30,000 次随机模糊测试：验证供应量守恒、自转账不变性、授权额度精确扣减及未授权拦截。",
  },
  {
    id: "minichain-v1",
    module: "MiniChainTest",
    file: "contracts/test/MiniChain.t.sol",
    plane: "EVM / Foundry",
    passed: 5,
    total: 5,
    highlightsEn: "Initial counter, single/100x state increments, string storage mutation, and string fuzzing.",
    highlightsZh: "初始计数器、单次及 100 次连续递增、字符串状态更新与随机字符串模糊测试。",
  },
  {
    id: "minichain-v2",
    module: "MiniChainV2Test",
    file: "contracts/test/MiniChainV2.t.sol",
    plane: "EVM / Foundry",
    passed: 3,
    total: 3,
    highlightsEn: "Immutable owner verification, authorized state updates, external contract unauthorized call rejection.",
    highlightsZh: "不可变所有者校验、授权修改验证、外部合约越权调用拦截 (Unauthorized 自定义错误)。",
  },
  {
    id: "disaster-recovery",
    module: "Disaster Recovery Audit",
    file: "consensus-lab/recovery_check.py",
    plane: "Disaster Recovery",
    passed: 6,
    total: 6,
    highlightsEn: "Anvil state dump/restore: Chain ID (31337), block height, block hash, stateRoot, MNC bytecode, and balance conservation.",
    highlightsZh: "Anvil 状态快照导出与灾难恢复：链 ID、区块高度、区块哈希、状态根、MNC 字节码与代币余额守恒 6/6 通过。",
  },
  {
    id: "bft-quorum",
    module: "BFT Quorum Safety Lab",
    file: "consensus-lab/bft_test.py",
    plane: "Python Consensus Lab",
    passed: 7,
    total: 7,
    highlightsEn: "Combinatorial quorum intersection proofs across (3,2), (4,3), and (7,5) validator configurations.",
    highlightsZh: "组合数学法定人数交集安全性验证：覆盖 (3,2)、(4,3) 与 (7,5) 拜占庭容错阈值模型。",
  },
  {
    id: "fault-tolerance",
    module: "Signed Vote Fault Audit",
    file: "consensus-lab/fault_test.py",
    plane: "Python Consensus Lab",
    passed: 8,
    total: 8,
    highlightsEn: "Offline nodes, forged Ed25519 signatures, duplicate voting, and equivocation/conflicting vote rejection.",
    highlightsZh: "节点离线、伪造 Ed25519 签名、重复投票及双签冲突选票剔除测试。",
  },
  {
    id: "two-phase",
    module: "Two-Phase Commit (Prevote/Precommit)",
    file: "consensus-lab/two_phase.py",
    plane: "Python Consensus Lab",
    passed: 5,
    total: 5,
    highlightsEn: "SHA-256 certificate digest binding Prevote QC to Precommit; blocks cross-phase replay and tampered proofs.",
    highlightsZh: "基于 SHA-256 证书摘要的两阶段提交 (Prevote → Precommit)，防御跨阶段重放与篡改。",
  },
  {
    id: "cross-round",
    module: "Cross-Round Safety & Liveness Lab",
    file: "consensus-lab/cross_round_test.py",
    plane: "Python Consensus Lab",
    passed: 7,
    total: 7,
    highlightsEn: "Exhaustive 81-state lock space analysis identifying 6 split-lock deadlock states under strict locking.",
    highlightsZh: "遍历全部 81 种跨轮次锁定状态组合，精确识别严格锁定下的 6 种分裂死锁状态。",
  },
  {
    id: "locking-sqlite",
    module: "Persistent SQLite Lock Store",
    file: "consensus-lab/locking_test.py",
    plane: "Python Consensus Lab",
    passed: 9,
    total: 9,
    highlightsEn: "Atomic BEGIN IMMEDIATE SQLite lock persistence before signing Precommit; crash/reopen safety verified.",
    highlightsZh: "先落盘锁定 (SQLite BEGIN IMMEDIATE) 后签名 Precommit，验证重启后跨轮次锁定持续生效。",
  },
  {
    id: "safe-unlock",
    module: "PoLC Safe Unlock Model",
    file: "consensus-lab/unlock_test.py",
    plane: "Python Consensus Lab",
    passed: 13,
    total: 13,
    highlightsEn: "Tendermint-style unlock rules requiring verified higher-round Prevote QC (locked_round < cert_round < round_id).",
    highlightsZh: "Tendermint 风格安全解锁验证：要求更高轮次有效法定人数证书 (locked_round < cert_round < round_id)。",
  },
  {
    id: "leader-rotation",
    module: "Round-Robin Leader & View Change",
    file: "consensus-lab/leader_test.py",
    plane: "Python Consensus Lab",
    passed: 6,
    total: 6,
    highlightsEn: "Deterministic proposer rotation across A/B/C/D with offline-leader timeout and invalid-proposal view change.",
    highlightsZh: "A/B/C/D 确定性轮询提案者切换，模拟离线超时与无效提案触发的视图切换恢复。",
  },
  {
    id: "finality-store",
    module: "SQLite Finality & History Audit",
    file: "consensus-lab/finality_test.py",
    plane: "Python Consensus Lab",
    passed: 10,
    total: 10,
    highlightsEn: "Immutable per-height finalized block storage, idempotent re-commit, and read-only cryptographic audit.",
    highlightsZh: "单高度不可篡改最终性存储、幂等提交与只读模式 (mode=ro) 历史记录密码学审计。",
  },
];

export interface ArchitectureModule {
  id: "nodes" | "consensus" | "cryptography" | "contracts" | "storage" | "recovery";
  plane: "consensus-lab" | "evm-plane" | "shared";
  titleEn: string;
  titleZh: string;
  subtitleEn: string;
  subtitleZh: string;
  files: string[];
  summaryEn: string;
  summaryZh: string;
  mechanicsEn: string[];
  mechanicsZh: string[];
  boundaryNoteEn: string;
  boundaryNoteZh: string;
}

export const ARCHITECTURE_MODULES: ArchitectureModule[] = [
  {
    id: "nodes",
    plane: "consensus-lab",
    titleEn: "Multi-Node P2P & RPC Observer Mesh",
    titleZh: "多节点通信与 RPC 观测网络",
    subtitleEn: "HTTP Peer Head Exchange, TCP Vote Transport & Multiprocess Validators",
    subtitleZh: "HTTP 节点头比对、TCP 选票传输与多进程独立验证器",
    files: ["consensus-lab/p2p.py", "consensus-lab/validators.py", "consensus-lab/network_consensus_v4.py", "consensus-lab/monitor.py"],
    summaryEn:
      "Simulates distributed validator topologies on local infrastructure using isolated OS processes (`multiprocessing` spawn context), TCP vote sockets with strict 8 KB frame caps, and HTTP peer comparison endpoints (`9101`/`9102`) observing up to 4 local Anvil EVM nodes (`8545`–`8548`).",
    summaryZh:
      "通过操作系统级独立进程 (`multiprocessing` spawn 模式)、带 8 KB 帧大小限制的 TCP 选票套接字，以及 HTTP 对等节点头比对服务 (`9101`/`9102`)，在本地观测最多 4 个独立 Anvil EVM 节点 (`8545`–`8548`)。",
    mechanicsEn: [
      "HTTP `/head` and `/compare` endpoints detect height, parentHash, and stateRoot divergence.",
      "OS-isolated validator child processes bind PID + random 256-bit challenge per consensus round.",
      "Real-time CLI telemetry monitor (`monitor.py`) tracks live quorum health across ports.",
    ],
    mechanicsZh: [
      "HTTP `/head` 与 `/compare` 接口实时检测区块高度、父哈希与状态根分叉。",
      "独立子进程验证器绑定进程 PID 与每轮 256 位随机挑战值，防止跨轮次重放。",
      "终端实时监控中心 (`monitor.py`) 追踪在线节点数与链头一致性。",
    ],
    boundaryNoteEn:
      "Python validator processes read block headers from Anvil RPC endpoints externally; they do not replace Anvil's internal block production engine.",
    boundaryNoteZh:
      "Python 验证器进程通过 JSON-RPC 从外部读取 Anvil 区块头，并未接管或替换 Anvil 内部的出块执行引擎。",
  },
  {
    id: "consensus",
    plane: "consensus-lab",
    titleEn: "BFT Consensus, Two-Phase Voting & Safe Unlock",
    titleZh: "BFT 共识、两阶段投票与跨轮次锁定机制",
    subtitleEn: "Quorum Intersection (3f+1), Prevote/Precommit QCs & PoLC Deadlock Resolution",
    subtitleZh: "法定人数交集 (3f+1)、两阶段证书与 Tendermint 风格安全解锁",
    files: ["consensus-lab/bft_test.py", "consensus-lab/two_phase.py", "consensus-lab/cross_round_test.py", "consensus-lab/unlock_test.py", "consensus-lab/leader_test.py"],
    summaryEn:
      "Models classical Byzantine Fault Tolerant consensus safety and liveness step by step: from quorum intersection math (4 validators, quorum 3 tolerating 1 Byzantine fault) to Two-Phase Prevote/Precommit certificates, cross-round block locking, exhaustive 81-state deadlock discovery, and Proof-of-Lock-Change (PoLC) safe unlocking.",
    summaryZh:
      "循序渐进实现经典 BFT 共识的安全性与活性机制：从 4 节点 3 票法定人数交集数学证明，到 Prevote/Precommit 两阶段证书、跨轮次区块锁定、81 种状态空间死锁穷举分析，以及基于更新轮次 QC 的安全解锁。",
    mechanicsEn: [
      "Phase 1 (PREVOTE) aggregates >= 3/4 signed votes and computes a deterministic SHA-256 certificate digest.",
      "Phase 2 (PRECOMMIT) embeds the Prevote digest proof and atomically locks the validator on that block.",
      "Safe Unlock permits switching locks only when `locked_round < cert_round < round_id` with a verified 3/4 QC.",
    ],
    mechanicsZh: [
      "第一阶段 (PREVOTE) 收集至少 3/4 签名选票，并计算确定性排序的 SHA-256 证书摘要。",
      "第二阶段 (PRECOMMIT) 绑定 Prevote 摘要证明，并在签名前对验证器执行跨轮次区块锁定。",
      "安全解锁规则仅在收到满足 `locked_round < cert_round < round_id` 的有效 3/4 法定人数证书时允许切换锁定。",
    ],
    boundaryNoteEn:
      "Consensus experiments operate as standalone protocol verification labs and external header-finality coordinators—not yet wired as an ABCI/Engine API consensus client for EVM execution.",
    boundaryNoteZh:
      "共识模块属于独立的协议验证实验室与外部区块头最终性协调器，尚未通过 Engine API 深度集成为 EVM 底层共识客户端。",
  },
  {
    id: "cryptography",
    plane: "shared",
    titleEn: "Cryptographic Primitives (SHA-256 & Ed25519)",
    titleZh: "密码学原语 (SHA-256 与 Ed25519 数字签名)",
    subtitleEn: "Canonical JSON Serialization, Signature Verification & Trusted Key Registry",
    subtitleZh: "规范化序列化、数字签名校验与受信任验证器公钥注册表",
    files: ["core-pow/blockchain.py", "consensus-lab/identity_v4.py", "consensus-lab/signed_consensus.py", "consensus-lab/audit_v4.py"],
    summaryEn:
      "Provides deterministic hashing (`SHA-256` over canonical `sort_keys=True` JSON payloads) for block linkage and Quorum Certificate digests, paired with `Ed25519` asymmetric signatures for transaction authorization and validator vote authentication.",
    summaryZh:
      "基于规范化 JSON (`sort_keys=True`) 的 `SHA-256` 哈希实现区块链接与法定人数证书摘要，并结合 `Ed25519` 非对称签名保障交易授权与验证器选票真实性。",
    mechanicsEn: [
      "Ed25519 private keys generated locally at runtime with `0600` file permissions (never committed to git).",
      "SHA-256 public-key fingerprinting and strict validator registry pinning prevent Sybil key injection.",
      "EVM plane uses native Ethereum `keccak256` and `secp256k1` transaction signatures on Anvil & Sepolia.",
    ],
    mechanicsZh: [
      "Ed25519 私钥仅在本地运行时以 `0600` 权限动态生成，严禁进入公开代码库。",
      "SHA-256 公钥指纹与受信任注册表绑定，拦截未知公钥与女巫节点注入。",
      "EVM 平面在 Anvil 与 Sepolia 测试网上使用以太坊原生 `keccak256` 与 `secp256k1` 签名体系。",
    ],
    boundaryNoteEn:
      "Python consensus labs use Ed25519 + SHA-256; Solidity smart contracts run on standard EVM secp256k1 + keccak256.",
    boundaryNoteZh:
      "Python 共识实验采用 Ed25519 + SHA-256；Solidity 合约层采用标准 EVM 的 secp256k1 + keccak256。",
  },
  {
    id: "contracts",
    plane: "evm-plane",
    titleEn: "EVM Smart Contracts & MNC ERC-20 Token",
    titleZh: "EVM 智能合约与 MNC (ERC-20) 代币",
    subtitleEn: "Solidity 0.8.28 on Foundry & Public Ethereum Sepolia Deployment",
    subtitleZh: "基于 Solidity 0.8.28 与 Foundry 开发，已部署至 Ethereum Sepolia 测试网",
    files: ["contracts/src/MNC.sol", "contracts/src/MiniChain.sol", "contracts/src/MiniChainV2.sol"],
    summaryEn:
      "Clean, zero-dependency Solidity `^0.8.28` contracts compiled and fuzz-tested with Foundry. Includes progressive state/access-control contracts (`MiniChain`, `MiniChainV2`) and the fixed-supply `MiniChain Coin (MNC)` ERC-20 contract deployed publicly on Ethereum Sepolia.",
    summaryZh:
      "零外部依赖的原生 Solidity `^0.8.28` 智能合约，使用 Foundry 编译与模糊测试。包含状态与权限控制合约 (`MiniChain`、`MiniChainV2`)，以及部署在 Ethereum Sepolia 公共测试网上的固定供应量代币 `MiniChain Coin (MNC)`。",
    mechanicsEn: [
      "Fixed immutable supply of 1,000,000 MNC (18 decimals); no `mint()`, `burn()`, proxy, or admin pause backdoors.",
      "Built-in Solidity 0.8.28 checked arithmetic prevents integer overflow and underflow.",
      "Deployed on Ethereum Sepolia (`Chain ID: 11155111`) at `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`.",
    ],
    mechanicsZh: [
      "恒定总供应量 1,000,000 MNC（18 位精度），无增发、无管理员冻结或代理升级后门。",
      "利用 Solidity 0.8.28 原生算术溢出检查，杜绝整数上溢与下溢漏洞。",
      "已公开部署于 Ethereum Sepolia (`Chain ID: 11155111`)，合约地址 `0x32C80Bb0fd51D32c31b52795a181042BF90E2Ee6`。",
    ],
    boundaryNoteEn:
      "MNC is an experimental Sepolia testnet token for engineering research only and has zero monetary value.",
    boundaryNoteZh:
      "MNC 是仅供工程研究的实验性测试网代币，不具备任何真实货币价值。",
  },
  {
    id: "storage",
    plane: "consensus-lab",
    titleEn: "SQLite Transactional Persistence & Audit",
    titleZh: "SQLite 事务持久化存储与历史审计",
    subtitleEn: "ACID Lock Persistence, Finalized Block Registry & Read-Only Tamper Audit",
    subtitleZh: "ACID 跨轮次锁存储、最终性区块账本与只读防篡改审计",
    files: ["consensus-lab/ledger_v4.py", "consensus-lab/locking_test.py", "consensus-lab/finality_test.py", "consensus-lab/integrated_finality.py"],
    summaryEn:
      "Persists validator locks, consensus round evidence, and finalized Quorum Certificates in relational SQLite databases using `BEGIN IMMEDIATE` write transactions to guarantee durability before any Precommit signature leaves the validator.",
    summaryZh:
      "采用 SQLite 数据库配合 `BEGIN IMMEDIATE` 立即事务，持久化存储验证器锁状态、共识轮次证据与最终性证书，确保在发出任何 Precommit 签名前完成落盘。",
    mechanicsEn: [
      "`locks` table keyed by `(validator, height)` survives process restarts and prevents equivocation after crash.",
      "`finalized` table enforces single-hash finality per height while remaining idempotent on re-commits.",
      "`audit_v4.py` opens SQLite in `mode=ro` (read-only URI) and re-verifies every historical Ed25519 signature.",
    ],
    mechanicsZh: [
      "`locks` 表以 `(validator, height)` 为复合主键，保障进程崩溃重启后仍拒绝冲突区块签名。",
      "`finalized` 表强制每个高度唯一最终区块哈希，支持相同证书幂等重放并拦截冲突提交。",
      "`audit_v4.py` 以 `mode=ro` 只读 URI 打开数据库，逐条重验全部历史 Ed25519 签名与票数统计。",
    ],
    boundaryNoteEn:
      "SQLite stores consensus metadata and certificates in the Python lab; EVM contract storage lives inside Anvil/Sepolia state tries.",
    boundaryNoteZh:
      "SQLite 负责存储 Python 实验层的共识证据与证书；EVM 合约状态则保存在 Anvil 或 Sepolia 的状态树中。",
  },
  {
    id: "recovery",
    plane: "evm-plane",
    titleEn: "State Synchronization & Disaster Recovery",
    titleZh: "节点状态同步与灾难恢复机制",
    subtitleEn: "Cryptographic State Export/Import & 6/6 Post-Restore Integrity Verification",
    subtitleZh: "EVM 状态快照导出导入与 6/6 灾备恢复完整性校验",
    files: ["consensus-lab/sync.py", "consensus-lab/recovery_check.py"],
    summaryEn:
      "Implements full EVM state snapshot export (`anvil_dumpState`) and cold-node disaster recovery (`anvil_loadState`) across local Anvil instances, verifying bit-for-bit chain height, block hash, `stateRoot`, contract bytecode, and ERC-20 token balances.",
    summaryZh:
      "基于 `anvil_dumpState` 与 `anvil_loadState` 实现本地 EVM 节点的完整状态导出、滞后节点同步与冷备节点灾难恢复，并对恢复后状态执行 6 项严格校验。",
    mechanicsEn: [
      "Detects source chain mutation mid-export before applying state snapshots to fresh recovery nodes.",
      "Verifies 6/6 invariants: Chain ID, block height, block hash, stateRoot, MNC bytecode, and token balances.",
      "Zero unchecked local state dumps are published to git; `recovery_check.py` tests recovery in ephemeral sandboxes.",
    ],
    mechanicsZh: [
      "在导出过程中校验源节点区块头是否变动，防止不一致快照污染恢复节点。",
      "执行 6/6 完整性检查：链 ID、区块高度、区块哈希、状态根、MNC 合约字节码及账户代币余额守恒。",
      "公开仓库绝不包含未经审计的本地备份文件，通过 `recovery_check.py` 在临时沙箱中可复现验证。",
    ],
    boundaryNoteEn:
      "Snapshot recovery targets local Anvil EVM development clusters; public Sepolia state is maintained globally by Ethereum testnet validators.",
    boundaryNoteZh:
      "快照恢复机制面向本地 Anvil EVM 实验集群；Sepolia 公共测试网状态由以太坊全球测试网验证节点维护。",
  },
];

export interface SourceFilePreview {
  id: string;
  path: string;
  language: "solidity" | "python";
  lines: number;
  descEn: string;
  descZh: string;
  code: string;
}

export const OPEN_SOURCE_PREVIEWS: SourceFilePreview[] = [
  {
    id: "mnc-sol",
    path: "contracts/src/MNC.sol",
    language: "solidity",
    lines: 101,
    descEn: "Zero-dependency ERC-20 contract deployed on Ethereum Sepolia (0x32C8...2Ee6).",
    descZh: "部署于 Ethereum Sepolia (0x32C8...2Ee6) 的零依赖原生 ERC-20 代币合约。",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MNC {
    string public constant name = "MiniChain Coin";
    string public constant symbol = "MNC";
    uint8 public constant decimals = 18;

    uint256 public constant totalSupply =
        1_000_000 * 10**18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        allowance[from][msg.sender] -= amount;
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Invalid recipient");
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }
}`,
  },
  {
    id: "unlock-py",
    path: "consensus-lab/unlock_test.py",
    language: "python",
    lines: 223,
    descEn: "Tendermint-style PoLC safe unlock validator state machine (13/13 tests passing).",
    descZh: "Tendermint 风格跨轮次锁定与高轮次 QC 安全解锁状态机（13/13 测试通过）。",
    code: `class Validator:
    def __init__(self, height):
        self.height = height
        self.locked_block = None
        self.locked_round = 0
        self.last_round = 0
        self.last_vote = None

    def prevote(self, round_id, block, cert=None, cert_round=0):
        if round_id <= 0 or round_id < self.last_round:
            return False
        if round_id == self.last_round:
            return block == self.last_vote

        if self.locked_block not in (None, block):
            if not (self.locked_round < cert_round < round_id):
                return False
            if not verify(cert, self.height, cert_round, block):
                return False

        self.last_round = round_id
        self.last_vote = block
        return True

    def precommit(self, round_id, block, cert):
        if (round_id, block) != (self.last_round, self.last_vote):
            return False
        if round_id < self.locked_round:
            return False
        if not verify(cert, self.height, round_id, block):
            return False

        self.locked_block = block
        self.locked_round = round_id
        return True`,
  },
  {
    id: "locking-py",
    path: "consensus-lab/locking_test.py",
    language: "python",
    lines: 205,
    descEn: "SQLite BEGIN IMMEDIATE atomic lock-before-sign persistence (9/9 tests passing).",
    descZh: "SQLite BEGIN IMMEDIATE 原子级先落盘锁定后签名机制（9/9 测试通过）。",
    code: `class LockStore:
    def precommit(self, name, height, round_id, block, cert):
        if name not in KEYS or not verify(cert, height, round_id, block):
            return None

        with closing(sqlite3.connect(self.path)) as db, db:
            db.execute("BEGIN IMMEDIATE")
            old = db.execute("""
                SELECT round_id, block_hash FROM locks
                WHERE validator = ? AND height = ?
            """, (name, height)).fetchone()

            if old:
                old_round, old_hash = old
                if block != old_hash or round_id < old_round:
                    return None

            db.execute("""
                INSERT OR REPLACE INTO locks VALUES (?, ?, ?, ?)
            """, (name, height, round_id, block))

        # Sign ONLY after the lock is durably committed to SQLite
        data = payload(name, "PRECOMMIT", height, round_id, block)
        return data, KEYS[name].sign(encode(data))`,
  },
  {
    id: "pow-py",
    path: "core-pow/blockchain.py",
    language: "python",
    lines: 124,
    descEn: "Minimal SHA-256 Proof-of-Work + Ed25519 signed transaction ledger & tamper detector.",
    descZh: "极简 SHA-256 工作量证明 + Ed25519 签名交易账本与篡改检测原型。",
    code: `def mine(transactions):
    block = {
        "index": len(chain),
        "previous_hash": chain[-1]["hash"] if chain else "0",
        "transactions": transactions,
        "nonce": 0
    }
    while True:
        h = sha256(block)
        if h.startswith("0" * DIFFICULTY):
            block["hash"] = h
            chain.append(block)
            return
        block["nonce"] += 1`,
  },
];
