# 🤝 Contributing to Obscura

First off, thank you for considering contributing to Obscura! It's people like you that make Obscura such a great tool for privacy-preserving computation.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Testing Guidelines](#testing-guidelines)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**
- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser, etc.)
- **Error messages** and stack traces

**Example:**
```markdown
**Bug**: Worker node crashes when claiming job

**Steps to Reproduce:**
1. Start worker node with `npm run dev`
2. Create a job in the frontend
3. Worker attempts to claim job
4. Node crashes with error: "Cannot read property 'jobId' of undefined"

**Expected**: Worker should claim job successfully
**Actual**: Worker crashes

**Environment:**
- OS: Ubuntu 22.04
- Node: v18.17.0
- Contract: 0x37F563b87B48bBcb12497A0a824542CafBC06d1F

**Error Log:**
```
[error]: Cannot read property 'jobId' of undefined
    at JobListener.claimJob (listener.ts:45)
```
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**
- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution** - how should it work?
- **Alternatives considered**
- **Additional context** - mockups, examples, etc.

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `documentation` - Improvements to docs

### Pull Requests

We actively welcome your pull requests!

---

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- MetaMask with Sepolia ETH

### Setup Steps

1. **Fork the repository**

Click the "Fork" button on GitHub.

2. **Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/obscura.git
cd obscura
```

3. **Add upstream remote**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/obscura.git
```

4. **Install dependencies**

```bash
# Root
npm install

# Contracts
cd contracts && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# Worker
cd worker && npm install && cd ..
```

5. **Set up environment variables**

```bash
# Contracts
cd contracts
cp .env.example .env
# Edit .env with your values

# Frontend
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your values

# Worker
cd ../worker
cp .env.example .env
# Edit .env with your values
```

6. **Run tests**

```bash
cd contracts
npm test
```

---

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Add tests for new features

### 3. Test Your Changes

```bash
# Run contract tests
cd contracts
npm test

# Run frontend locally
cd frontend
npm run dev

# Run worker locally
cd worker
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

See [Commit Messages](#commit-messages) for guidelines.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit!

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

---

## Coding Standards

### TypeScript/JavaScript

**Style Guide:**
- Use TypeScript for type safety
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await over promises
- Use meaningful variable names
- Keep functions small and focused

**Example:**
```typescript
// Good ✅
const calculateReward = async (jobId: number): Promise<string> => {
  const job = await contract.getJob(jobId);
  return ethers.formatEther(job.reward);
};

// Bad ❌
var calc = function(id) {
  return contract.getJob(id).then(j => ethers.formatEther(j.reward));
};
```

### Solidity

**Style Guide:**
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments
- Order: state variables, events, modifiers, functions
- Use explicit visibility modifiers
- Check for reentrancy vulnerabilities

**Example:**
```solidity
// Good ✅
/**
 * @notice Creates a new computation job
 * @param computationType Type of computation to perform
 * @param encryptedInputs Encrypted input data
 * @return jobId Unique identifier for the job
 */
function createJob(
    uint8 computationType,
    bytes memory encryptedInputs
) external payable returns (uint256 jobId) {
    // Implementation
}

// Bad ❌
function createJob(uint8 t, bytes memory i) public payable returns (uint256) {
    // Implementation
}
```

### React/Next.js

**Style Guide:**
- Use functional components
- Use hooks for state management
- Keep components small and reusable
- Use TypeScript interfaces for props
- Use meaningful component names

**Example:**
```typescript
// Good ✅
interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  return (
    <div className="job-card">
      <h3>{job.computationType}</h3>
      <button onClick={() => onViewDetails(job.jobId)}>
        View Details
      </button>
    </div>
  );
};

// Bad ❌
export function Card(props: any) {
  return <div>{props.data.type}</div>;
}
```

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(frontend): add job filtering by status"

# Bug fix
git commit -m "fix(worker): resolve race condition in job claiming"

# Documentation
git commit -m "docs: update deployment guide with Vercel instructions"

# Breaking change
git commit -m "feat(contract): change reward calculation

BREAKING CHANGE: Reward now includes platform fee in calculation"
```

---

## Testing Guidelines

### Smart Contract Tests

**Location:** `contracts/test/`

**Requirements:**
- Test all public functions
- Test edge cases and error conditions
- Test access control
- Test state changes
- Aim for >80% coverage

**Example:**
```typescript
describe("Obscura", function () {
  it("Should create a job successfully", async function () {
    const { obscura, client } = await loadFixture(deployFixture);
    
    const tx = await obscura.connect(client).createJob(
      0, // Addition
      "0x1234",
      { value: ethers.parseEther("0.001") }
    );
    
    await expect(tx)
      .to.emit(obscura, "JobCreated")
      .withArgs(1, client.address, 0, anyValue);
  });
});
```

### Frontend Tests

**Location:** `frontend/src/__tests__/`

**Requirements:**
- Test component rendering
- Test user interactions
- Test hooks
- Test error states

### Integration Tests

**Requirements:**
- Test complete user flows
- Test contract + frontend integration
- Test worker + contract integration

---

## Documentation

### Code Comments

- Add comments for complex logic
- Use JSDoc/NatSpec for functions
- Explain "why", not "what"

### README Updates

Update README.md if you:
- Add new features
- Change setup process
- Add new dependencies
- Change API

### Documentation Files

Update docs/ if you:
- Change architecture
- Add new APIs
- Change deployment process

---

## Review Process

### What We Look For

- ✅ Code quality and style
- ✅ Test coverage
- ✅ Documentation updates
- ✅ No breaking changes (or properly documented)
- ✅ Performance considerations
- ✅ Security implications

### Timeline

- Initial review: Within 3-5 days
- Follow-up reviews: Within 2 days
- Merge: After approval from maintainers

---

## Getting Help

- **Discord**: [Join our community](https://discord.gg/obscura)
- **GitHub Discussions**: Ask questions
- **Email**: dev@obscura.fhe

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Obscura!** 🎭

*Together, we're building the future of privacy-preserving computation.*

