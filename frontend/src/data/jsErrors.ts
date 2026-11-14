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
  searchKeywords: string[];
}

export const jsErrors: JsError[] = [
  {
    slug: 'typeerror-cannot-read-properties-of-undefined',
    title: "Fix: Uncaught TypeError: Cannot read properties of undefined",
    exactMessage: `Uncaught TypeError: Cannot read properties of undefined (reading 'map')`,
    metaTitle: "Fix Uncaught TypeError: Cannot read properties of undefined",
    metaDescription: "Fix 'Cannot read properties of undefined (reading 'map')' in JavaScript and React. Learn why this happens with async data and how to use optional chaining (?.).",
    shortAnswer: "This error occurs when you try to access a property (like .map, .length, or .name) on a variable that is currently undefined. The most common fix is optional chaining (?.) or ensuring the variable is initialized.",
    cause: "JavaScript evaluates accessors from left to right. If the object is undefined, accessing .map or .length throws a TypeError. In React, this usually happens when component state is initialized as undefined instead of an empty array [].",
    badCode: `const items = undefined;\nitems.map(item => item);\n// Uncaught TypeError: Cannot read properties of undefined (reading 'map')`,
    goodCode: `const items = undefined;\n\n// Option 1: Optional Chaining\nitems?.map(item => item);\n\n// Option 2: Fallback to empty array\n(items || []).map(item => item);`,
    steps: [
      "Find the line in the console error and identify which variable is undefined",
      "Use console.log() right before that line to confirm the variable's value",
      "Apply optional chaining (?.) if the property might legitimately be undefined",
      "If it's React state, ensure your initial useState value is an empty array [] and not null or undefined"
    ],
    faqs: [
      { q: "What does optional chaining (?.) do?", a: "It safely accesses nested properties. If the reference before the ?. is null or undefined, the expression short-circuits and returns undefined instead of throwing." },
      { q: "Why does this happen with API data?", a: "When you fetch data asynchronously, the component renders before the data arrives. The initial state is often undefined. Use a loading state or default value." },
      { q: "Is 'Cannot read property of undefined' the same?", a: "Yes, it's the older V8 engine phrasing. The fix is exactly the same." }
    ],
    related: ['typeerror-cannot-set-properties-of-null', 'referenceerror-x-is-not-defined'],
    searchKeywords: ["cannot read property map of undefined", "reading 'map' of undefined", "uncaught typeerror cannot read properties", "cannot read properties of undefined react"]
  },
  {
    slug: 'referenceerror-x-is-not-defined',
    title: "Fix: Uncaught ReferenceError: x is not defined",
    exactMessage: `Uncaught ReferenceError: myVariable is not defined`,
    metaTitle: "Fix Uncaught ReferenceError: x is not defined — JS",
    metaDescription: "Fix Uncaught ReferenceError: x is not defined in JavaScript. Cause, scope issues, and working fixes. Free AI JS fixer.",
    shortAnswer: "ReferenceError means you are trying to use a variable that has not been declared in the current scope. Check for typos, missing import statements, or variables used outside their block scope.",
    cause: "JavaScript uses lexical scoping. If a variable is declared inside a function or block, it cannot be accessed outside. Also, accessing a let/const variable before its declaration causes a ReferenceError.",
    badCode: `function greet() {\n  let message = "Hello";\n}\ngreet();\nconsole.log(message);\n// Uncaught ReferenceError: message is not defined`,
    goodCode: `function greet() {\n  let message = "Hello";\n  return message;\n}\nconst msg = greet();\nconsole.log(msg);`,
    steps: [
      "Check for spelling mistakes — 'myVar' vs 'myvariable'",
      "Ensure the variable is declared with let, const, or var before use",
      "If the variable is inside a function or block, make sure you are accessing it from within that scope",
      "Check if you forgot to import a module or function at the top of the file"
    ],
    faqs: [
      { q: "What is the Temporal Dead Zone?", a: "With let and const, variables are hoisted but cannot be accessed until their declaration is executed. Accessing them before throws a ReferenceError." },
      { q: "Why does it work in the console but not in my script?", a: "The browser console evaluates code in the global scope. Your script might be wrapped in a module or function scope where the variable isn't declared." }
    ],
    related: ['typeerror-cannot-read-properties-of-undefined', 'typeerror-x-is-not-a-function'],
    searchKeywords: ["uncaught referenceerror", "is not defined javascript", "reference error react", "variable is not defined"]
  },
  {
    slug: 'syntaxerror-unexpected-end-of-json-input',
    title: "Fix: Uncaught SyntaxError: Unexpected end of JSON input",
    exactMessage: `Uncaught SyntaxError: Unexpected end of JSON input`,
    metaTitle: "Fix Unexpected end of JSON input — JavaScript Error",
    metaDescription: "Fix Uncaught SyntaxError: Unexpected end of JSON input. Cause, empty API responses, and how to safely parse JSON.",
    shortAnswer: "This error occurs when JSON.parse() receives an empty string or incomplete JSON. It usually happens when an API returns a blank response, or you are parsing an undefined variable.",
    cause: "JSON.parse requires a valid JSON string. If the string is empty (''), undefined, or truncated, the parser reaches the end before finding a valid JSON structure, throwing 'Unexpected end of JSON input'.",
    badCode: `const data = "";\nJSON.parse(data);\n// Uncaught SyntaxError: Unexpected end of JSON input`,
    goodCode: `const data = "";\ntry {\n  const parsed = JSON.parse(data);\n} catch (e) {\n  console.error("Invalid JSON");\n}\n\n// Or check first:\nif (data) JSON.parse(data);`,
    steps: [
      "Open the Network tab in DevTools and check the API response",
      "If the response is empty, fix the backend API to return valid JSON (e.g., '{}' or '[]')",
      "Wrap JSON.parse() in a try-catch block to prevent the app from crashing",
      "Ensure you are not parsing local storage items that might be empty"
    ],
    faqs: [
      { q: "Why is my API returning an empty string?", a: "The server might be crashing, returning a 204 No Content status, or your fetch request might be failing silently." },
      { q: "Does this happen with localStorage?", a: "Yes. If you try to parse a key that doesn't exist, localStorage.getItem returns null, which can cause this if parsed directly." }
    ],
    related: ['unexpected-token-in-json', 'cors-policy-error'],
    searchKeywords: ["unexpected end of json input", "uncaught syntaxerror json", "json parse empty string", "unexpected end of json input fetch"]
  },
  {
    slug: 'typeerror-cannot-set-properties-of-null',
    title: "Fix: Uncaught TypeError: Cannot set properties of null",
    exactMessage: `Uncaught TypeError: Cannot set properties of null (setting 'innerHTML')`,
    metaTitle: "Fix Cannot set properties of null — JavaScript",
    metaDescription: "Fix Uncaught TypeError: Cannot set properties of null (setting 'innerHTML' or 'value'). Learn why DOM elements are null.",
    shortAnswer: "This means you are trying to set a property (like .innerHTML or .value) on an HTML element that does not exist in the DOM. This usually happens if the script runs before the HTML is loaded, or the ID/class is misspelled.",
    cause: "document.getElementById() returns null if no matching element is found. Trying to do element.innerHTML = '...' when element is null throws this error. This is common in Vanilla JS DOM manipulation.",
    badCode: `document.getElementById("myBtn").innerHTML = "Clicked";\n// Uncaught TypeError: Cannot set properties of null`,
    goodCode: `const btn = document.getElementById("myBtn");\nif (btn) {\n  btn.innerHTML = "Clicked";\n}\n\n// Or ensure script is at the end of body:\n// <script src="app.js"></script></body>`,
    steps: [
      "Check if the ID or class name in your JS matches exactly with your HTML",
      "Make sure your script tag is placed at the end of the <body> or uses defer/async",
      "Use if (element) checks before setting properties",
      "If using React/Vue, avoid direct DOM manipulation like this entirely"
    ],
    faqs: [
      { q: "Why is getElementById returning null?", a: "Because the element hasn't been rendered yet. If your <script> is in the <head>, it runs before the <body> is parsed." },
      { q: "What is the fix in Vanilla JS?", a: "Move your <script> to the end of the <body>, or wrap your code in document.addEventListener('DOMContentLoaded', () => { ... })." }
    ],
    related: ['typeerror-cannot-read-properties-of-undefined', 'referenceerror-x-is-not-defined'],
    searchKeywords: ["cannot set properties of null", "setting innerhtml of null", "getelementbyid null", "cannot set property innerhtml"]
  },
  {
    slug: 'typeerror-x-is-not-a-function',
    title: "Fix: Uncaught TypeError: x is not a function",
    exactMessage: `Uncaught TypeError: myFunc is not a function`,
    metaTitle: "Fix TypeError: x is not a function — JavaScript",
    metaDescription: "Fix TypeError: x is not a function in JS. Cause, common scenarios (typos, wrong imports, async issues) and fixes. Free AI debugger.",
    shortAnswer: "This error means you are trying to call something as a function that is not actually a function. It could be a string, object, or undefined. Check your imports and variable names.",
    cause: "Common causes include: misspelling a built-in method (e.g., 'toUppercase' instead of 'toUpperCase'), importing a default export incorrectly, or trying to call an object as a function.",
    badCode: `const str = "hello";\nstr.toUppercase();\n// Uncaught TypeError: str.toUppercase is not a function`,
    goodCode: `const str = "hello";\nstr.toUpperCase();\n\n// Or check the type before calling\nif (typeof myFunc === 'function') {\n  myFunc();\n}`,
    steps: [
      "Check the exact spelling and capitalization of the function name (JS is case-sensitive)",
      "Use console.log(typeof myFunc) to see what type it actually is",
      "If it's an import, verify it's a named export vs default export",
      "If it's an array method (e.g., .map), ensure the variable is actually an array"
    ],
    faqs: [
      { q: "Why is my imported function undefined?", a: "You might be using the wrong import syntax. For default exports use import func from './file', for named exports use import { func } from './file'." },
      { q: "Does this happen with callbacks?", a: "Yes, if you pass a variable that is undefined or not a function to an event listener or array method." }
    ],
    related: ['referenceerror-x-is-not-defined', 'typeerror-cannot-read-properties-of-undefined'],
    searchKeywords: ["is not a function", "uncaught typeerror not a function", "array map is not a function", "import is not a function"]
  },
  {
    slug: 'cannot-read-property-length-of-null',
    title: "Fix: Cannot read property 'length' of null",
    exactMessage: `TypeError: Cannot read properties of null (reading 'length')`,
    metaTitle: "Fix Cannot read property 'length' of null — JS",
    metaDescription: "Fix TypeError: Cannot read property 'length' of null in JavaScript. Cause, array check fixes, and code examples.",
    shortAnswer: "This happens when you try to get the .length of a variable that is null. Ensure the variable is an array or string before checking its length, or use optional chaining (?.length).",
    cause: "Unlike undefined, null is an explicit assignment representing 'no value'. Accessing .length on null throws an error. This often happens when an API returns null instead of an empty array [].",
    badCode: `let items = null;\nconsole.log(items.length);\n// TypeError: Cannot read properties of null`,
    goodCode: `let items = null;\n\nconsole.log(items?.length || 0);\n\nitems = items || [];\nconsole.log(items.length);`,
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
    related: ['typeerror-cannot-read-properties-of-undefined', 'unexpected-token-in-json'],
    searchKeywords: ["cannot read property length of null", "reading length of null", "length of undefined javascript"]
  },
  {
    slug: 'unexpected-token-in-json',
    title: "Fix: SyntaxError: Unexpected token in JSON",
    exactMessage: `SyntaxError: Unexpected token < in JSON at position 0`,
    metaTitle: "Fix Unexpected token < in JSON at position 0 — JS",
    metaDescription: "Fix SyntaxError: Unexpected token in JSON at position 0. Cause, API response handling, and JSON.parse fixes.",
    shortAnswer: "This means JSON.parse() received a string that is not valid JSON. 'Unexpected token <' almost always means you received an HTML page (like a 404 or 500 error) instead of JSON.",
    cause: "When fetch() or axios receives a response, you call .json() to parse it. If the server returns HTML (e.g., an error page) instead of JSON, the parser fails on the first character '<'.",
    badCode: `fetch('/api/data')\n  .then(res => res.json()) // Fails if server returns HTML\n  .then(data => console.log(data));`,
    goodCode: `fetch('/api/data')\n  .then(res => {\n    if (!res.ok) throw new Error("Server error");\n    return res.json();\n  })\n  .catch(err => console.error("Not JSON:", err));`,
    steps: [
      "Open the Network tab in DevTools",
      "Find the failing API request and look at the Response tab",
      "If it's HTML, your API route is returning an error page",
      "Check your API endpoint URL and the server logs"
    ],
    faqs: [
      { q: "Why does this happen with fetch()?", a: "By default, fetch() does not reject the promise on HTTP errors like 404. It resolves, and you try to parse an HTML error page as JSON." },
      { q: "How do I safely parse JSON?", a: "Wrap JSON.parse in a try/catch block, or check the Content-Type header before parsing." }
    ],
    related: ['syntaxerror-unexpected-end-of-json-input', 'cors-policy-error'],
    searchKeywords: ["unexpected token in json", "unexpected token < in json", "json at position 0", "syntaxerror json parse"]
  },
  {
    slug: 'cors-policy-error',
    title: "Fix: CORS Policy Error (Access-Control-Allow-Origin)",
    exactMessage: `Access to fetch at 'http://...' from origin 'http://...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.`,
    metaTitle: "Fix CORS Policy Error — No Access-Control-Allow-Origin",
    metaDescription: "Fix CORS policy error in JavaScript. Understand cross-origin requests, preflight, and how to configure the server.",
    shortAnswer: "CORS is a browser security feature. This error means your backend server is not sending the 'Access-Control-Allow-Origin' header, so the browser blocks your frontend from reading the response.",
    cause: "Browsers enforce the Same-Origin Policy. If your frontend calls an API on a different domain, the server must explicitly allow it via CORS headers.",
    badCode: `// Frontend fetch request\nfetch('http://localhost:5000/api/data')\n  .then(res => res.json());\n// Browser blocks it if backend doesn't have CORS headers`,
    goodCode: `// Backend (Express.js example)\nconst cors = require('cors');\napp.use(cors({ origin: 'http://localhost:5173' }));`,
    steps: [
      "Understand that CORS is a server-side fix, not a frontend fix",
      "If you control the backend, add a CORS middleware",
      "Configure the specific origin for security",
      "For development only, you can use a proxy in Vite/Webpack"
    ],
    faqs: [
      { q: "Why does it work in Postman but not the browser?", a: "Postman is a backend tool and does not enforce browser security policies like CORS." },
      { q: "What is a preflight request?", a: "For non-simple requests, the browser sends an OPTIONS request first. The server must respond with the allowed methods and headers." }
    ],
    related: ['unexpected-token-in-json', 'typeerror-x-is-not-a-function'],
    searchKeywords: ["cors policy error", "access-control-allow-origin", "cors error fetch", "blocked by cors policy"]
  },
  {
    slug: 'maximum-call-stack-size-exceeded',
    title: "Fix: RangeError: Maximum call stack size exceeded",
    exactMessage: `RangeError: Maximum call stack size exceeded`,
    metaTitle: "Fix Maximum call stack size exceeded — JS",
    metaDescription: "Fix RangeError: Maximum call stack size exceeded in JavaScript. Cause, infinite recursion, and how to fix it.",
    shortAnswer: "This error occurs when a function calls itself (directly or indirectly) without a proper exit condition, causing infinite recursion. It can also happen if you accidentally cause infinite state updates in React.",
    cause: "Every function call adds a frame to the call stack. Infinite recursion (missing base case) exhausts this stack, throwing a RangeError.",
    badCode: `function countDown(n) {\n  console.log(n);\n  countDown(n - 1); // No base case!\n}`,
    goodCode: `function countDown(n) {\n  if (n <= 0) return; // Base case\n  console.log(n);\n  countDown(n - 1);\n}`,
    steps: [
      "Look for a recursive function in the stack trace",
      "Add a base case that stops the recursion",
      "If you are using React, check for a useEffect that updates state without a proper dependency array",
      "For deeply nested data, use an iterative approach (loops)"
    ],
    faqs: [
      { q: "How do I know if it's React causing this?", a: "In React, this often presents as 'Maximum update depth exceeded'. It means a useEffect is triggering a state update that triggers the effect again." },
      { q: "Can I increase the stack size?", a: "Node.js allows --stack-size=2000. However, in browsers, you cannot change it." }
    ],
    related: ['invalid-hook-call-react', 'referenceerror-x-is-not-defined'],
    searchKeywords: ["maximum call stack size exceeded", "rangeerror call stack", "infinite loop javascript", "recursion error"]
  },
  {
    slug: 'invalid-hook-call-react',
    title: "Fix: Invalid hook call in React",
    exactMessage: `Error: Invalid hook call. Hooks can only be called inside of the body of a function component.`,
    metaTitle: "Fix Invalid Hook Call in React — Cause and Solution",
    metaDescription: "Fix 'Invalid hook call' error in React. Common causes: mismatched versions, calling hooks conditionally, or duplicate React.",
    shortAnswer: "This React error happens for three main reasons: 1) Hooks are called inside a regular function or condition, 2) You have multiple versions of React installed, or 3) You are calling a hook outside a component.",
    cause: "React relies on the exact order of hook calls to maintain state. If you call a hook conditionally or inside a regular JS function, React loses track.",
    badCode: `function MyComponent() {\n  if (condition) {\n    const [state, setState] = useState(0); // Conditional hook!\n  }\n  return <div>Test</div>;\n}`,
    goodCode: `function MyComponent() {\n  const [state, setState] = useState(0); // Always at the top\n  if (!condition) return null;\n  return <div>{state}</div>;\n}`,
    steps: [
      "Check that all hooks are called at the top level of your component",
      "Run npm ls react to check for multiple versions of React",
      "Delete node_modules and package-lock.json, then run npm install",
      "Ensure you aren't calling a hook inside a regular utility function"
    ],
    faqs: [
      { q: "Why does React care about hook order?", a: "React uses an array internally to store hook states. It relies on the order of execution to know which state belongs to which useState call." },
      { q: "How do I fix duplicate React versions?", a: "Use npm dedupe or add a resolutions field in package.json to force a single React version." }
    ],
    related: ['typeerror-cannot-read-properties-of-undefined', 'maximum-call-stack-size-exceeded'],
    searchKeywords: ["invalid hook call", "react hooks error", "hooks can only be called inside", "invalid hook call react"]
  },
  {
    slug: 'referenceerror-dollar-is-not-defined',
    title: "Fix: Uncaught ReferenceError: $ is not defined",
    exactMessage: `Uncaught ReferenceError: $ is not defined`,
    metaTitle: "Fix ReferenceError: $ is not defined (jQuery) — JavaScript",
    metaDescription: "Fix Uncaught ReferenceError: $ is not defined in JavaScript. Learn why jQuery is not loading and how to fix it.",
    shortAnswer: "This error means jQuery is not loaded, but your script is trying to use the $ symbol. You either forgot to include the jQuery script tag, or it's loading after your script.",
    cause: "The $ is just an alias for jQuery. If the jQuery library is not loaded before your custom script runs, the browser doesn't know what $ means.",
    badCode: `<script src="app.js"></script>\n<!-- jQuery included after app.js -->\n<script src="jquery.js"></script>`,
    goodCode: `<!-- jQuery MUST load first -->\n<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>\n<script src="app.js"></script>`,
    steps: [
      "Check if you have included the jQuery <script> tag in your HTML",
      "Ensure jQuery loads BEFORE your custom JS file",
      "Check the Network tab to see if the jQuery file returned a 404 error",
      "If using a bundler like Vite/Webpack, ensure jQuery is imported correctly"
    ],
    faqs: [
      { q: "What is the $ symbol in JS?", a: "It's just a valid variable name. In the context of jQuery, it's a function used to select elements. Without jQuery, it's undefined." },
      { q: "Why does this happen in WordPress?", a: "WordPress runs jQuery in 'noConflict' mode. You have to use jQuery instead of $, or wrap your code in a function." }
    ],
    related: ['referenceerror-x-is-not-defined', 'typeerror-cannot-set-properties-of-null'],
    searchKeywords: ["$ is not defined", "jquery is not defined", "uncaught referenceerror $", "dollar sign is not defined"]
  },
  {
    slug: 'dom-exception-not-enough-arguments',
    title: "Fix: Uncaught DOMException: Failed to execute 'querySelector'",
    exactMessage: `Uncaught DOMException: Failed to execute 'querySelector' on 'Document': '##id' is not a valid selector.`,
    metaTitle: "Fix Uncaught DOMException querySelector — Invalid Selector",
    metaDescription: "Fix Uncaught DOMException: Failed to execute 'querySelector' on 'Document'. Cause, invalid CSS selectors, and how to fix.",
    shortAnswer: "This means you passed an invalid CSS selector to querySelector() or querySelectorAll(). Examples include extra dots (##id) or spaces where they don't belong.",
    cause: "querySelector expects a valid CSS string (like '.class', '#id', 'div'). If you pass something like '##id' or misspell it, the browser throws a DOMException.",
    badCode: `document.querySelector("##myId");\n// Uncaught DOMException: '##myId' is not a valid selector.`,
    goodCode: `document.querySelector("#myId"); // Single hash for ID\ndocument.querySelector(".myClass"); // Single dot for class`,
    steps: [
      "Check the selector string for extra dots (.), hashes (#), or spaces",
      "Remember: # is for IDs, . is for classes, and plain text is for tags",
      "If the selector comes from user input or variables, validate it first",
      "Use try/catch to handle invalid selectors gracefully"
    ],
    faqs: [
      { q: "What is a valid selector?", a: "Any valid CSS selector string, such as '#id', '.class', 'div > p', or 'input[type=\"text\"]'." },
      { q: "Why does document.querySelector return null instead of throwing?", a: "It only throws if the string is invalid CSS. If the string is valid but no element matches, it returns null." }
    ],
    related: ['typeerror-cannot-set-properties-of-null', 'typeerror-cannot-read-properties-of-undefined'],
    searchKeywords: ["failed to execute queryselector", "domexception queryselector", "is not a valid selector", "queryselector error"]
  }
];
