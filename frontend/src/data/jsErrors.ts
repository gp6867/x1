export interface JsError {
  slug: string;
  title: string;
  exactMessage: string;
  metaTitle: string;
  metaDescription: string;
  shortAnswer: string;
  cause: string;
  badCode: string;
  goodCode: string;
  steps: string[];
  faqs: { q: string; a: string }[];
  related: string[];
}

export const jsErrors: JsError[] = [
  {
    slug: 'typeerror-cannot-read-properties-of-undefined',
    title: "Fix: TypeError: Cannot read properties of undefined",
    exactMessage: `TypeError: Cannot read properties of undefined (reading 'x')`,
    metaTitle: "Fix TypeError: Cannot read properties of undefined — JS",
    metaDescription: "Fix 'TypeError: Cannot read properties of undefined' in JavaScript. Cause, optional chaining fix, and code examples. Free AI fixer.",
    shortAnswer: "This error occurs when you try to access a property on a variable that is currently undefined. The most common fix is using optional chaining (?.) or ensuring the variable is properly initialized before accessing it.",
    cause: "JavaScript evaluates accessors like obj.prop from left to right. If obj is undefined, attempting to access .prop throws a TypeError. This usually happens with async data, uninitialized state, or misspelled object keys.",
    badCode: `const user = undefined;\nconsole.log(user.name);\n// TypeError: Cannot read properties of undefined (reading 'name')`,
    goodCode: `const user = undefined;\n\n// Option 1: Optional Chaining (ES2020+)\nconsole.log(user?.name); // Returns undefined, no error\n\n// Option 2: Fallback check\nconsole.log(user && user.name);`,
    steps: [
      "Find the line in the console error and identify which variable is undefined",
      "Use console.log() right before that line to confirm the variable's value",
      "Apply optional chaining (?.) if the property might legitimately be undefined",
      "Fix the root cause — usually an API call hasn't resolved yet, or a typo in the variable name"
    ],
    faqs: [
      { q: "What does optional chaining (?.) do?", a: "It safely accesses nested properties. If the reference before the ?. is null or undefined, the expression short-circuits and returns undefined instead of throwing." },
      { q: "Why does this happen with API data?", a: "When you fetch data asynchronously, the component renders before the data arrives. The initial state is often undefined or null. Use conditional rendering or a loading state." },
      { q: "Is it the same as 'Cannot read property of undefined'?", a: "Yes, it's the newer V8 engine phrasing. Older browsers say 'Cannot read property'x' of undefined'." }
    ],
    related: ['cannot-read-property-length-of-null', 'referenceerror-x-is-not-defined']
  },
  {
    slug: 'referenceerror-x-is-not-defined',
    title: "Fix: ReferenceError: x is not defined",
    exactMessage: `ReferenceError: myVariable is not defined`,
    metaTitle: "Fix ReferenceError: x is not defined — JavaScript",
    metaDescription: "Fix ReferenceError: x is not defined in JavaScript. Cause, scope issues, and working fixes. Free AI JS fixer.",
    shortAnswer: "ReferenceError means you are trying to use a variable that has not been declared in the current scope. Check for typos, missing import statements, or variables used outside their block scope.",
    cause: "JavaScript uses lexical scoping. If a variable is declared inside a function or block, it cannot be accessed outside. Also, accessing a variable before its declaration (with let/const) causes a ReferenceError due to the Temporal Dead Zone.",
    badCode: `function greet() {\n  let message = "Hello";\n}\ngreet();\nconsole.log(message);\n// ReferenceError: message is not defined`,
    goodCode: `function greet() {\n  let message = "Hello";\n  return message;\n}\nconst msg = greet();\nconsole.log(msg);`,
    steps: [
      "Check for spelling mistakes — 'myVar' vs 'myvariable'",
      "Ensure the variable is declared with let, const, or var before use",
      "If the variable is inside a function or block, make sure you are accessing it from within that scope",
      "Check if you forgot to import a module or function at the top of the file"
    ],
    faqs: [
      { q: "What is the Temporal Dead Zone?", a: "With let and const, variables are hoisted but cannot be accessed until their declaration is executed. Accessing them before throws a ReferenceError." },
      { q: "Why does it work in the console but not in my script?", a: "The browser console evaluates code in the global scope. Your script might be wrapped in a module or function scope where the variable isn't declared." },
      { q: "How do I access a variable from another file?", a: "You must export it from the original file (export const x = 1) and import it in the target file (import { x } from './file.js')." }
    ],
    related: ['typeerror-cannot-read-properties-of-undefined', 'typeerror-x-is-not-a-function']
  },
  {
    slug: 'typeerror-x-is-not-a-function',
    title: "Fix: TypeError: x is not a function",
    exactMessage: `TypeError: myFunc is not a function`,
    metaTitle: "Fix TypeError: x is not a function — JavaScript",
    metaDescription: "Fix TypeError: x is not a function in JS. Cause, common scenarios (typos, wrong imports, async issues) and fixes. Free AI debugger.",
    shortAnswer: "This error means you are trying to call something as a function that is not actually a function. It could be a string, object, or undefined. Check your imports and variable names.",
    cause: "Common causes include: misspelling a built-in method (e.g., 'toUppercase' instead of 'toUpperCase'), importing a default export incorrectly, or trying to call an object as a function.",
    badCode: `const str = "hello";\nstr.toUppercase();\n// TypeError: str.toUppercase is not a function`,
    goodCode: `const str = "hello";\n// Correct capitalization\nstr.toUpperCase();\n\n// Or check the type before calling\nif (typeof myFunc === 'function') {\n  myFunc();\n}`,
    steps: [
      "Check the exact spelling and capitalization of the function name (JS is case-sensitive)",
      "Use console.log(typeof myFunc) to see what type it actually is",
      "If it's an import, verify it's a named export vs default export",
      "If it's an array method (e.g., .map), ensure the variable is actually an array"
    ],
    faqs: [
      { q: "Why is my imported function undefined?", a: "You might be using the wrong import syntax. For default exports use `import func from './file'`, for named exports use `import { func } from './file'`." },
      { q: "Does this happen with callbacks?", a: "Yes, if you pass a variable that is undefined or not a function to an event listener or array method like .map() or .forEach()." }
    ],
    related: ['referenceerror-x-is-not-defined', 'typeerror-cannot-read-properties-of-undefined']
  },
  {
    slug: 'cannot-read-property-length-of-null',
    title: "Fix: Cannot read property 'length' of null",
    exactMessage: `TypeError: Cannot read properties of null (reading 'length')`,
    metaTitle: "Fix Cannot read property 'length' of null — JS",
    metaDescription: "Fix TypeError: Cannot read property 'length' of null in JavaScript. Cause, array check fixes, and code examples.",
    shortAnswer: "This happens when you try to get the .length of a variable that is null. Ensure the variable is an array or string before checking its length, or use optional chaining (?.length).",
    cause: "Unlike undefined, null is an explicit assignment representing 'no value'. Accessing .length on null throws an error. This often happens when an API returns null instead of an empty array [].",
    badCode: `let items = null;\nconsole.log(items.length);\n// TypeError: Cannot read properties of null (reading 'length')`,
    goodCode: `let items = null;\n\n// Option 1: Optional chaining\nconsole.log(items?.length || 0);\n\n// Option 2: Default to empty array\nitems = items || [];\nconsole.log(items.length);`,
    steps: [
      "Identify which variable is null (use console.log)",
      "Check if an API is returning null instead of []",
      "Use optional chaining (data?.length)",
      "Provide a fallback value: (data || []).length"
    ],
    faqs: [
      { q: "What is the difference between null and undefined?", a: "undefined means a variable has been declared but not assigned a value. null is an explicit assignment representing no value." },
      { q: "How to check if a variable is an array?", a: "Use Array.isArray(myVar). This returns true for arrays and false for null, undefined, objects, and strings." }
    ],
    related: ['typeerror-cannot-read-properties-of-undefined', 'unexpected-token-in-json']
  },
  {
    slug: 'unexpected-token-in-json',
    title: "Fix: SyntaxError: Unexpected token in JSON",
    exactMessage: `SyntaxError: Unexpected token < in JSON at position 0`,
    metaTitle: "Fix Unexpected token in JSON at position 0 — JS",
    metaDescription: "Fix SyntaxError: Unexpected token in JSON at position 0. Cause, API response handling, and JSON.parse fixes.",
    shortAnswer: "This means JSON.parse() received a string that is not valid JSON. 'Unexpected token <' almost always means you received an HTML page (like a 404 or 500 error) instead of JSON.",
    cause: "When fetch() or axios receives a response, you call .json() to parse it. If the server returns HTML (e.g., an error page) instead of JSON, the parser fails on the first character '<' (the start of an HTML tag).",
    badCode: `fetch('/api/data')\n  .then(res => res.json()) // Fails if server returns HTML\n  .then(data => console.log(data));`,
    goodCode: `fetch('/api/data')\n  .then(res => {\n    if (!res.ok) throw new Error("Server error");\n    return res.json();\n  })\n  .then(data => console.log(data))\n  .catch(err => console.error("Not JSON:", err));`,
    steps: [
      "Open the Network tab in DevTools",
      "Find the failing API request and look at the Response tab",
      "If it's HTML (starting with <!DOCTYPE or <html>), your API route is returning an error page",
      "Check your API endpoint URL and the server logs"
    ],
    faqs: [
      { q: "Why does this happen with fetch()?", a: "By default, fetch() does not reject the promise on HTTP errors like 404 or 500. It resolves, and you try to parse an HTML error page as JSON." },
      { q: "How do I safely parse JSON?", a: "Wrap JSON.parse in a try/catch block, or check the Content-Type header before parsing." }
    ],
    related: ['cors-policy-error', 'typeerror-cannot-read-properties-of-undefined']
  },
  {
    slug: 'cors-policy-error',
    title: "Fix: CORS Policy Error (Access-Control-Allow-Origin)",
    exactMessage: `Access to fetch at 'http://...' from origin 'http://...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.`,
    metaTitle: "Fix CORS Policy Error — No Access-Control-Allow-Origin",
    metaDescription: "Fix CORS policy error in JavaScript. Understand cross-origin requests, preflight, and how to configure the server.",
    shortAnswer: "CORS is a browser security feature. This error means your backend server is not sending the 'Access-Control-Allow-Origin' header, so the browser blocks your frontend from reading the response.",
    cause: "Browsers enforce the Same-Origin Policy. If your frontend (e.g., localhost:5173) calls an API on a different domain (e.g., api.example.com), the server must explicitly allow it via CORS headers.",
    badCode: `// Frontend fetch request\nfetch('http://localhost:5000/api/data')\n  .then(res => res.json());\n// Browser blocks it if backend doesn't have CORS headers`,
    goodCode: `// Backend (Express.js example)\nconst cors = require('cors');\napp.use(cors({ origin: 'http://localhost:5173' }));\n\n// Or manually set headers:\napp.use((req, res, next) => {\n  res.setHeader('Access-Control-Allow-Origin', '*');\n  next();\n});`,
    steps: [
      "Understand that CORS is a server-side fix, not a frontend fix",
      "If you control the backend, add a CORS middleware (like Express 'cors' package)",
      "Configure the specific origin (e.g., your frontend URL) for security",
      "For development only, you can use a proxy in Vite/Webpack to bypass CORS"
    ],
    faqs: [
      { q: "Why does it work in Postman but not the browser?", a: "Postman is a backend tool and does not enforce browser security policies like CORS. Browsers block reading cross-origin responses by default." },
      { q: "What is a preflight request?", a: "For non-simple requests (like PUT/DELETE or custom headers), the browser sends an OPTIONS request first. The server must respond with the allowed methods and headers." }
    ],
    related: ['unexpected-token-in-json', 'typeerror-x-is-not-a-function']
  },
  {
    slug: 'maximum-call-stack-size-exceeded',
    title: "Fix: RangeError: Maximum call stack size exceeded",
    exactMessage: `RangeError: Maximum call stack size exceeded`,
    metaTitle: "Fix Maximum call stack size exceeded — JS",
    metaDescription: "Fix RangeError: Maximum call stack size exceeded in JavaScript. Cause, infinite recursion, and how to fix it.",
    shortAnswer: "This error occurs when a function calls itself (directly or indirectly) without a proper exit condition, causing infinite recursion. It can also happen if you accidentally cause infinite state updates in React.",
    cause: "Every function call adds a frame to the call stack. The stack has a fixed size. Infinite recursion (missing base case) or a circular function call exhausts this stack, throwing a RangeError.",
    badCode: `function countDown(n) {\n  console.log(n);\n  countDown(n - 1); // No base case!\n}`,
    goodCode: `function countDown(n) {\n  if (n <= 0) return; // Base case\n  console.log(n);\n  countDown(n - 1);\n}`,
    steps: [
      "Look for a recursive function in the stack trace",
      "Add a base case that stops the recursion when a condition is met",
      "If you are using React, check for a useEffect that updates state without a proper dependency array (causing infinite re-renders)",
      "For deeply nested data, consider an iterative approach (loops) instead of recursion"
    ],
    faqs: [
      { q: "How do I know if it's React causing this?", a: "In React, this often presents as 'Maximum update depth exceeded'. It means a useEffect is triggering a state update that triggers the effect again." },
      { q: "Can I increase the stack size?", a: "Node.js allows `node --stack-size=2000`. However, in browsers, you cannot change it. You must fix the recursion." }
    ],
    related: ['typeerror-x-is-not-a-function', 'referenceerror-x-is-not-defined']
  },
  {
    slug: 'invalid-hook-call-react',
    title: "Fix: Invalid hook call in React",
    exactMessage: `Error: Invalid hook call. Hooks can only be called inside of the body of a function component.`,
    metaTitle: "Fix Invalid Hook Call in React — Cause and Solution",
    metaDescription: "Fix 'Invalid hook call' error in React. Common causes: mismatched versions, calling hooks conditionally, or duplicate React.",
    shortAnswer: "This React error happens for three main reasons: 1) Hooks are called inside a regular function, loop, or condition, 2) You have multiple versions of React installed (duplicate), or 3) You are calling a hook outside a component.",
    cause: "React relies on the exact order of hook calls to maintain state. If you call a hook conditionally or inside a regular JS function, React loses track. Duplicate React versions cause the internal dispatcher to fail.",
    badCode: `function MyComponent() {\n  if (condition) {\n    const [state, setState] = useState(0); // Conditional hook!\n  }\n  return <div>Test</div>;\n}`,
    goodCode: `function MyComponent() {\n  const [state, setState] = useState(0); // Always at the top\n  if (!condition) return null;\n  return <div>{state}</div>;\n}`,
    steps: [
      "Check that all hooks (useState, useEffect, etc.) are called at the top level of your component, not inside loops, conditions, or nested functions",
      "Run `npm ls react` to check for multiple versions of React",
      "If you have duplicate React, delete node_modules and package-lock.json, then run npm install",
      "Ensure you aren't calling a hook inside a regular utility function (it must be a component or a custom hook starting with 'use')"
    ],
    faqs: [
      { q: "Why does React care about hook order?", a: "React uses an array internally to store hook states. It relies on the order of execution to know which state belongs to which useState call." },
      { q: "How do I fix duplicate React versions?", a: "Use npm dedupe or add a resolutions field in package.json to force a single React version across your dependencies." }
    ],
    related: ['typeerror-cannot-read-properties-of-undefined', 'referenceerror-x-is-not-defined']
  }
];
