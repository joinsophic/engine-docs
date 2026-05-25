---
name: multi-language-examples
description: Generate code examples in Python, Node.js, Go, Java, and C# wrapped in a Mintlify CodeGroup. Use when adding or updating code samples in documentation.
---

# Multi-Language Code Examples

Generate equivalent code examples in all five supported languages, wrapped in a Mintlify `<CodeGroup>` component.

## When to Use

- When adding a new code example to any `.mdx` page.
- When an existing example only covers one or two languages.
- When the user asks for a code sample for a specific feature.

## Instructions

1. Write the example in **all five languages**, in this order:
   - Python (idiomatic 3.10+, type hints, f-strings)
   - Node.js (CommonJS `require()` style)
   - Go (standard library only)
   - Java (17+, Spring Boot conventions for HTTP handlers)
   - C# (.NET 8+, minimal API style where appropriate)

2. Wrap them in a `<CodeGroup>`:

```mdx
<CodeGroup>
```python Python
# implementation
```

```javascript Node.js
// implementation
```

```go Go
// implementation
```

```java Java
// implementation
```

```csharp C#
// implementation
```
</CodeGroup>
```

3. Each implementation must be **functionally equivalent**: same inputs, same outputs, same behavior.
4. Use each language's **idiomatic style**. Don't transliterate Python into Java.
5. For cryptographic operations, always use **constant-time comparison**:
   - Python: `hmac.compare_digest`
   - Node.js: `crypto.timingSafeEqual`
   - Go: `hmac.Equal`
   - Java: `MessageDigest.isEqual`
   - C#: `CryptographicOperations.FixedTimeEquals`
6. Keep examples **concise**. Show the essential logic. Use placeholder function names like `processEvent()` or `alreadyProcessed()` for application-specific logic.
