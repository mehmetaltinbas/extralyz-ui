# SOLID Principles in React

## 1. Single Responsibility Principle (SRP)

A component or hook should have one reason to change.
Separate logic from presentation. Move complex state management or data fetching into Custom Hooks.

## 2. Open-Closed Principle (OCP)

Software entities should be open for extension but closed for modification.
Use strategy pattern if a new behavior is needed rather than adding if/else or switch/case blocks.

## 3. Liskov Substitution Principle (LSP)

Subtypes must be substitutable for their base types without affecting correctness.

## 4. Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use.
Create small, specific interfaces rather than one massive "God Interface." This prevents classes from having to implement methods that are irrelevant to their specific context.

## 5. Dependency Inversion Principle (DIP)

Depend on abstractions, not concretions.

# Architectural & Design Principles

## 6. Composition over Inheritance

React is designed around a powerful composition model.
Avoid class-based inheritance. Use Higher-Order Components (HOCs), Render Props, or (most commonly) Hooks and Component Composition to share functionality between different parts of the UI.

## 7. Don't Repeat Yourself (DRY)

Reduce repetition of patterns and logic.
Abstract recurring UI patterns into Shared Components (e.g., Card, Modal) and recurring logic into Utility Functions or Custom Hooks. However, avoid "Premature Abstraction"—only dry up code once a pattern repeats significantly.

## 8. Separation of Concerns (SoC)

The application should be split into distinct sections, each addressing a separate concern.
Adhere to the Module-based architecture. Each feature should be encapsulated in its own Module.

## 9. Law of Demeter (LoD)

A component should only talk to its "immediate friends."
Avoid "Prop Drilling" (passing data through 5 layers of components that don't need it). Use Context or a State Management library to provide data directly to the components that require it, preventing the middle-men from knowing too much.

## 10. Keep it Simple, Stupid (KISS)

Simplicity is the ultimate sophistication.
Prefer readable code over "clever" code. Use descriptive variable names, avoid deeply nested ternary operators in JSX, and don't introduce complex libraries (like a heavy form manager) if a simple useState will suffice.

## Note for Claude

When refactoring, prioritize readability and type safety. Every interface should be explicitly defined, and any logic that exceeds 10 lines within a component body should be evaluated for extraction into a custom hook.
