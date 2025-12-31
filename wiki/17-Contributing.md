# Contributing Guide

Guidelines for contributing to the JoinUp project.

---

## Welcome!

We appreciate your interest in contributing to JoinUp! This guide will help you understand the process and best practices.

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/JoinUp-Event-Management.git
cd JoinUp-Event-Management
```

### 2. Create Feature Branch

```bash
# Always create branch from main/develop
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-you-are-fixing
```

### 3. Set Up Development Environment

```bash
# Backend
cd backend
npm install
npm run seed
npm run start:dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

---

## Development Workflow

### 1. Make Your Changes

Follow the [Code Style Guide](./16-Code-Style.md) when coding.

**Keep commits small and focused:**
```bash
# Good - one logical change per commit
git commit -m "feat: add event filtering by category"
git commit -m "fix: validate event capacity before registration"

# Avoid - multiple unrelated changes
git commit -m "add categories, fix dates, update styles"
```

### 2. Write Tests

**Test Coverage Requirements:**
- 70%+ unit test coverage
- All new public methods tested
- Happy path and error cases

```bash
# Run tests
npm test

# Run with coverage
npm run test:cov

# Run specific test
npm test -- service.spec
```

### 3. Run Linting & Format

```bash
# Format code
npm run format

# Check for lint errors
npm run lint

# Fix lint errors
npm run lint -- --fix
```

### 4. Test Locally

**Backend Tests:**
```bash
cd backend
npm test          # Unit tests
npm run test:e2e  # Integration tests
```

**Frontend Tests:**
```bash
cd frontend
npm test           # Unit tests
npm run e2e        # E2E tests (Cypress)
```

**Manual Testing:**
1. Verify app runs: `npm start` & `npm run start:dev`
2. Test feature manually in browser
3. Check browser console for errors
4. Test on mobile if UI changes

### 5. Commit & Push

```bash
# Review your changes
git diff

# Stage specific files
git add path/to/file

# Commit with descriptive message
git commit -m "feat: describe your change"

# Push to your fork
git push origin feature/your-feature-name
```

---

## Commit Message Convention

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test additions/modifications
- **chore**: Build, dependencies, tooling

### Examples

```
feat(events): add event filtering by category

Add ability to filter events by one or more categories.
Implements API query parameter support and frontend UI.

Closes #123
```

```
fix(auth): prevent token expiration on inactive sessions

Users now remain logged in as long as token hasn't expired,
regardless of inactivity time. Fixes #456.
```

```
docs: update installation instructions for macOS
```

---

## Pull Request Process

### 1. Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Go to GitHub and click "Create Pull Request"
```

### 2. Fill PR Template

**PR Title**: Use same format as commit message  
**PR Description**:
```markdown
## Description
Brief description of changes

## Changes
- Change 1
- Change 2
- Change 3

## Related Issues
Closes #123

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

## Screenshots (if UI changes)
[Add screenshots]

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Tests pass
- [ ] No new warnings generated
- [ ] Documentation updated
```

### 3. Code Review

**Expectations:**
- Code reviewer will review within 48 hours
- Constructive feedback provided
- Ask questions if unclear
- Be respectful and professional

**Responding to Feedback:**
- Make requested changes
- Commit with message: `fix: address review feedback`
- Push changes
- Notify reviewer

### 4. Approval & Merge

Once approved:
- All CI checks must pass
- No merge conflicts
- Squash commits if requested
- Merge to main branch

---

## Adding Features

### Feature Checklist

Before submitting PR, ensure:

- [ ] Feature works as expected
- [ ] Unit tests written (80%+ coverage)
- [ ] Integration tests written (if API changes)
- [ ] E2E tests written (if user-facing feature)
- [ ] Code follows style guide
- [ ] No console warnings/errors
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Performance impact assessed

### Adding Backend Feature

**Steps:**
1. Create DTO for input validation
2. Create entity if new database table needed
3. Create service with business logic
4. Create controller with HTTP endpoints
5. Create tests for service and controller
6. Add swagger documentation
7. Update API docs
8. Update database schema docs if needed

**Example:**
```typescript
// 1. DTO
export class CreateNewFeatureDto {
  @IsString() title: string;
  @IsNumber() value: number;
}

// 2. Service
@Injectable()
export class NewFeatureService {
  async create(dto: CreateNewFeatureDto): Promise<NewFeature> { }
}

// 3. Controller
@Controller('new-feature')
export class NewFeatureController {
  @Post()
  async create(@Body() dto: CreateNewFeatureDto) { }
}

// 4. Tests
describe('NewFeatureService', () => {
  it('should create feature', async () => { });
});
```

### Adding Frontend Feature

**Steps:**
1. Create component with standalone decorator
2. Create service if needed
3. Add routing
4. Create tests
5. Add i18n translations
6. Update documentation

**Example:**
```typescript
// 1. Component
@Component({
  selector: 'app-new-feature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `...`,
})
export class NewFeatureComponent { }

// 2. Add to routes
{
  path: 'new-feature',
  component: NewFeatureComponent,
  canActivate: [AuthGuard],
}

// 3. Tests
describe('NewFeatureComponent', () => {
  it('should create', () => { });
});
```

---

## Bug Fixes

### Reporting a Bug

1. Check if bug already reported in Issues
2. Create new issue with:
   - Clear title describing bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, browser, version)
   - Screenshots if applicable

### Fixing a Bug

1. Create branch: `git checkout -b fix/bug-name`
2. Add test that reproduces bug
3. Fix the bug
4. Verify test passes
5. Submit PR with reference to issue: `Closes #123`

---

## Documentation

### Updating Docs

When you add features, update documentation:

1. **Code Comments**: Explain complex logic
2. **README**: Update if setup changes
3. **API Docs**: Update if endpoints change
4. **User Guides**: Add user-facing features
5. **Architecture Docs**: If major changes

### Writing Good Docs

- Use clear, concise language
- Include examples
- Link to related docs
- Keep it current
- Test docs accuracy

---

## Code Review Tips

### Reviewing Others' Code

- **Be respectful** - Criticism of code, not person
- **Ask questions** - "Can you explain why...?"
- **Suggest alternatives** - "Have you considered...?"
- **Praise good code** - "Nice approach!"
- **Check tests** - Ensure good test coverage
- **Test locally** - Run the code yourself

### Checklist for Reviewers

- [ ] Code follows style guide
- [ ] Tests are comprehensive
- [ ] No console errors/warnings
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] No security issues
- [ ] Database migrations handled
- [ ] Backwards compatible

---

## Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes (1.0.0)
- **MINOR**: New features, backwards compatible (1.1.0)
- **PATCH**: Bug fixes (1.1.1)

### Release Checklist

1. Update version in `package.json`
2. Update CHANGELOG
3. Tag release: `git tag v1.0.0`
4. Push: `git push --tags`
5. Create release on GitHub

---

## Development Tools

### Recommended Tools

- **VS Code**: Code editor
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Angular Language Service
  - Thunder Client (for API testing)
- **Git**: Version control
- **Chrome DevTools**: Debugging
- **Postman**: API testing (alternative to Thunder Client)

### Setup VS Code

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Common Issues

### Merge Conflicts

```bash
# Update your branch with latest main
git fetch origin
git rebase origin/main

# Fix conflicts in editor
# Then continue
git add .
git rebase --continue

# Force push your branch
git push origin feature/name --force-with-lease
```

### Accidentally Committed Sensitive Data

```bash
# Don't push! Immediately:
git reset --soft HEAD~1
# Remove sensitive file
git reset HEAD filename
# Commit again
git commit -m "commit message"
```

### Need to Undo Commits

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo specific commit in middle
git revert <commit-hash>
```

---

## Community Guidelines

### Be Respectful

- Treat all contributors with respect
- Assume good intentions
- Disagree professionally
- No harassment, discrimination, or hate speech

### Give Credit

- Acknowledge contributors
- Reference issues and PRs
- Thank reviewers
- Credit original authors if using code

### Share Knowledge

- Help junior developers
- Document solutions
- Answer questions
- Write clear explanations

---

## Getting Help

### Resources

- **Documentation**: Check wiki first
- **GitHub Issues**: Search existing issues
- **Code Comments**: Read explanation in code
- **Google/Stack Overflow**: For general programming questions
- **Ask Team**: Reach out on Slack/email

### Asking Questions

- Provide context
- Show what you've tried
- Include error messages
- Be specific and clear

---

## Contribution Ideas

### Good Starting Issues

- Documentation improvements
- Bug fixes
- Test coverage improvements
- Code refactoring
- Performance optimizations

### Feature Ideas

- New language support
- Enhanced reporting
- Mobile app
- Advanced search
- API enhancements

---

## Acknowledgment

Thank you for contributing! Your work helps make JoinUp better for everyone. All contributors will be acknowledged in:
- CONTRIBUTORS.md
- Release notes
- Project documentation

---

## Questions?

- Open an issue for discussion
- Ask in comments on PR
- Reach out to team

**Welcome aboard!** 🚀

---

## Related Documentation

- [Code Style Guide](./16-Code-Style.md)
- [Testing Guide](./13-Testing-Guide.md)
- [Architecture Overview](./09-Architecture.md)
- [ADRs](./12-ADRs.md)

---

**Thank you for making JoinUp better!**
