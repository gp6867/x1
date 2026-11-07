export interface PythonError {
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

export const pythonErrors: PythonError[] = [
  {
    slug: 'typeerror-can-only-concatenate-str-not-int-to-str',
    title: "Fix: TypeError: can only concatenate str (not 'int') to str",
    exactMessage: `TypeError: can only concatenate str (not "int") to str`,
    metaTitle: "Fix TypeError: can only concatenate str (not int) to str — Python",
    metaDescription: "Fix 'TypeError: can only concatenate str (not \"int\") to str' in Python. Cause, working fix, and code examples. Free AI fixer, no signup.",
    shortAnswer: "This TypeError occurs when you use the + operator between a string and an integer in Python. Python does not auto-convert types, so you must wrap the integer with str(), or use an f-string for implicit conversion.",
    cause: "Python's + operator behaves differently for strings and integers: for strings it concatenates, for integers it adds. Mixing the two raises TypeError because Python refuses to guess whether you want '12' or 3 from '1' + 2. Unlike JavaScript, Python never silently coerces types.",
    badCode: `total = "Total: " + 100\n# TypeError: can only concatenate str (not "int") to str`,
    goodCode: `# Option 1: explicit str()\ntotal = "Total: " + str(100)\n\n# Option 2: f-string (recommended)\ntotal = f"Total: {100}"\n\n# Option 3: format()\ntotal = "Total: {}".format(100)`,
    steps: [
      "Find the line where a string is added to a non-string with +",
      "Wrap the non-string value with str() or convert it inside an f-string",
      "If you are sure you wanted numeric addition, remove the quotes from the string",
      "Test with print(type(...)) before the + to verify both operands are strings"
    ],
    faqs: [
      { q: "Why does Python not auto-convert int to str?", a: "Python is strongly typed by design. Auto-conversion hides bugs, so Python forces you to be explicit with str() or f-strings." },
      { q: "What is the fastest way to fix this error?", a: "Use an f-string: f\"Total: {100}\". It is faster than str() and more readable." },
      { q: "Does the same error occur with floats?", a: "Yes. Any non-str type (int, float, bool, list) mixed with a string using + raises this TypeError." }
    ],
    related: ['nameerror-name-is-not-defined', 'attributeerror-nonetype-object-has-no-attribute']
  },
  {
    slug: 'modulenotfounderror-no-module-named',
    title: "Fix: ModuleNotFoundError: No module named 'X'",
    exactMessage: `ModuleNotFoundError: No module named 'requests'`,
    metaTitle: "Fix ModuleNotFoundError: No module named — Python",
    metaDescription: "Fix ModuleNotFoundError: No module named in Python. Cause, pip install steps, virtual environment check, and code examples. Free AI fixer.",
    shortAnswer: "ModuleNotFoundError means Python cannot find the package you tried to import. The three common causes are: the package is not installed, you are in a different virtual environment, or the module name is misspelled.",
    cause: "When Python executes import X, it searches sys.path for a matching package. If none exists — because pip install was never run, or the active virtualenv is different from the one you installed into — Python raises ModuleNotFoundError. On rare occasions the package exists but is named differently from the import statement.",
    badCode: `import requests\n# ModuleNotFoundError: No module named 'requests'`,
    goodCode: `# Step 1: install the package\n# pip install requests\n\n# Step 2: verify it is available\nimport requests\nprint(requests.__version__)`,
    steps: [
      "Run pip list | grep <package> to confirm it is installed in the current environment",
      "If missing, run pip install <package> — the name you pip install may differ from the import name (e.g. pip install pillow, import PIL)",
      "Check which Python you are using: which python and which pip must point to the same virtualenv",
      "Restart your terminal or IDE so the PATH changes take effect"
    ],
    faqs: [
      { q: "Why does pip install succeed but import still fails?", a: "You likely installed into a different Python interpreter. Run python -m pip install <package> so pip uses the same Python that runs your script." },
      { q: "Does this happen in Docker?", a: "Yes. If your Dockerfile installs the package in one layer and runs your script in another Python image, the import fails. Install and run in the same image." },
      { q: "What about relative imports?", a: "The error message differs — 'attempted relative import with no known parent package' — usually fixed by running as a module: python -m package.module." }
    ],
    related: ['importerror-cannot-import-name', 'typeerror-can-only-concatenate-str-not-int-to-str']
  },
  {
    slug: 'attributeerror-nonetype-object-has-no-attribute',
    title: "Fix: AttributeError: 'NoneType' object has no attribute 'X'",
    exactMessage: `AttributeError: 'NoneType' object has no attribute 'append'`,
    metaTitle: "Fix AttributeError: NoneType has no attribute — Python",
    metaDescription: "Fix AttributeError: 'NoneType' object has no attribute in Python. Find out why the value is None and the right fix. Free AI error fixer.",
    shortAnswer: "This AttributeError means you are calling a method or property on a value that is None. Find out why the variable became None — usually a failed lookup, a function without a return statement, or an uninitialized attribute — rather than masking it with a default.",
    cause: "None is Python's null value. It has no methods, so calling anything on it raises AttributeError. The root cause is almost always upstream: my_list.sort() returns None, dict.get() returns None when the key is missing, a function without an explicit return returns None, or an object was never initialized.",
    badCode: `result = [3, 1, 2].sort()\nresult.append(4)\n# AttributeError: 'NoneType' object has no attribute 'append'`,
    goodCode: `my_list = [3, 1, 2]\nmy_list.sort()          # sorts in place, returns None\nmy_list.append(4)       # call on the list, not the return value\n\n# Or use the built-in sorted() which returns a new list\nresult = sorted([3, 1, 2])\nresult.append(4)`,
    steps: [
      "Find the exact line in the traceback and identify which variable is None",
      "Trace the variable back to where it was assigned — add print(type(x)) before the failing line",
      "Check if a function that 'should' return a value is missing a return statement",
      "If you want a default, consider raising a clearer error instead of using getattr(obj, 'x', None) which hides the bug"
    ],
    faqs: [
      { q: "Should I use getattr(obj, 'x', None) to fix this?", a: "No. That hides the real bug. Fix the upstream issue — usually a None value where you expected an object — instead of masking it." },
      { q: "How do I know which value is None?", a: "Read the traceback: the last line points to the failing expression. Add print(type(x), repr(x)) just before that line to see which variable is None." },
      { q: "What if my API returns None?", a: "APIs often return None on failure or missing fields. Check the response for None before using it, and raise a specific exception if it should always be present." }
    ],
    related: ['typeerror-can-only-concatenate-str-not-int-to-str', 'keyerror']
  },
  {
    slug: 'nameerror-name-is-not-defined',
    title: "Fix: NameError: name 'X' is not defined",
    exactMessage: `NameError: name 'x' is not defined`,
    metaTitle: "Fix NameError: name is not defined — Python",
    metaDescription: "Fix NameError: name 'x' is not defined in Python. Cause, common scenarios (typos, scope, order of definitions) and working fixes. Free AI tool.",
    shortAnswer: "NameError means Python cannot find a variable or function name in the current scope. The most common causes are a typo, using a variable before it is defined, or referencing an outer-scope name that is not accessible inside a function.",
    cause: "Python resolves names at runtime, not at compile time. When it evaluates an expression that refers to x, it looks in the local scope, then enclosing scopes, then module globals, then built-ins. If none contain x, it raises NameError. This differs from C++ or Java where undeclared variables fail at compile time.",
    badCode: `print(usename)\n# NameError: name 'usename' is not defined`,
    goodCode: `username = "samrat"\nprint(username)\n\n# In a function, declare global explicitly if you must modify it\ndef update():\n    global username\n    username = "new"`,
    steps: [
      "Check the exact variable name — typos like 'usename' instead of 'username' are the top cause",
      "Verify the variable is assigned BEFORE the line that uses it",
      "If inside a function, confirm the name is accessible (local, enclosing, global, or passed as argument)",
      "If modifying a global inside a function, use the global keyword, or better, return the new value"
    ],
    faqs: [
      { q: "What is the difference between NameError and UnboundLocalError?", a: "UnboundLocalError occurs when a variable is assigned somewhere inside a function but used before that assignment. NameError occurs when the name does not exist in any scope." },
      { q: "Why does it work in REPL but not in a script?", a: "REPL preserves state between lines. In a script, code runs top to bottom — a variable must be defined before use." },
      { q: "How do I access a global variable inside a function?", a: "Just read it — reading is automatic. To assign, use global x. Better still, pass the value as a function argument and return the new value." }
    ],
    related: ['typeerror-can-only-concatenate-str-not-int-to-str', 'attributeerror-nonetype-object-has-no-attribute']
  },
  {
    slug: 'indentationerror-unexpected-indent',
    title: "Fix: IndentationError: unexpected indent",
    exactMessage: `IndentationError: unexpected indent`,
    metaTitle: "Fix IndentationError: unexpected indent — Python",
    metaDescription: "Fix IndentationError: unexpected indent in Python. Cause, mixed tabs and spaces, and how to fix consistently. Free AI Python fixer.",
    shortAnswer: "IndentationError: unexpected indent means a line has more leading whitespace than Python expects at that point. This almost always happens when you mix tabs and spaces, or when you accidentally indent a line that should be at the top level.",
    cause: "Python uses indentation to delimit code blocks — no curly braces. If a line is indented without being inside a block (after if:, def:, for:, etc.), Python raises IndentationError. Mixing tabs (\\t) and spaces is the most common trigger because the two look identical but count differently.",
    badCode: `def greet():\n    print("hello")\n        print("extra indent")\n# IndentationError: unexpected indent`,
    goodCode: `def greet():\n    print("hello")\n    print("still inside function")`,
    steps: [
      "Open the file in an editor that shows whitespace characters (VS Code: View → Render Whitespace)",
      "Convert all tabs to 4 spaces (or all spaces to tabs — but be consistent)",
      "Ensure the failing line is at the same indent level as its siblings",
      "In VS Code, use 'Convert Indentation to Spaces' from the command palette"
    ],
    faqs: [
      { q: "Why does Python not allow mixed tabs and spaces?", a: "In Python 3 (since 3.0), mixing tabs and spaces raises TabError, a subclass of IndentationError. Python 2 was lenient but inconsistent across editors — Python 3 forbids it." },
      { q: "What is the standard indent size?", a: "PEP 8 recommends 4 spaces per indent level. Never use tabs in Python 3." },
      { q: "My code looks fine — how do I find the bad indent?", a: "Use cat -A file.py or a whitespace-visible editor. The bad line will show ^I (tab) or an extra 4-space block." }
    ],
    related: ['syntaxerror-invalid-syntax', 'nameerror-name-is-not-defined']
  },
  {
    slug: 'indexerror-list-index-out-of-range',
    title: "Fix: IndexError: list index out of range",
    exactMessage: `IndexError: list index out of range`,
    metaTitle: "Fix IndexError: list index out of range — Python",
    metaDescription: "Fix IndexError: list index out of range in Python. Cause, off-by-one bugs, and how to safely access lists. Free AI Python fixer.",
    shortAnswer: "IndexError: list index out of range means you accessed an element at a position that does not exist. Lists are 0-indexed, so a list with 3 elements has valid indices 0, 1, and 2 — accessing index 3 or higher raises IndexError.",
    cause: "When you write my_list[i], Python checks that 0 <= i < len(my_list). If i is equal to or greater than the list length (or negative beyond -len), it raises IndexError. The most common scenario is a loop that uses <= len(my_list) instead of < len(my_list), or an API that returned fewer items than expected.",
    badCode: `items = [10, 20, 30]\nprint(items[3])\n# IndexError: list index out of range`,
    goodCode: `items = [10, 20, 30]\n\n# Check before accessing\nif len(items) > 3:\n    print(items[3])\n\n# Or use safe access with default\ndef safe_get(lst, i, default=None):\n    return lst[i] if 0 <= i < len(lst) else default\n\n# Or catch the exception\ntry:\n    print(items[3])\nexcept IndexError:\n    print("not enough items")`,
    steps: [
      "Print len(your_list) right before the failing line to see the real size",
      "Check your loop bounds — range(len(lst)) is safer than manual indexing",
      "If the list comes from an API or file, verify the count first",
      "For 'last element' access, use my_list[-1] which is safe when the list is non-empty"
    ],
    faqs: [
      { q: "Does negative indexing ever raise IndexError?", a: "Yes, if the index is too negative. On a 3-element list, my_list[-3] is valid (first item) but my_list[-4] raises IndexError." },
      { q: "How do I iterate safely?", a: "Prefer for item in my_list instead of for i in range(len(my_list)): my_list[i]. This avoids the index entirely." },
      { q: "What about NumPy arrays?", a: "NumPy raises the same IndexError but with extra context. Use arr.shape to confirm dimensions before indexing." }
    ],
    related: ['keyerror', 'attributeerror-nonetype-object-has-no-attribute']
  },
  {
    slug: 'keyerror',
    title: "Fix: KeyError when accessing a dictionary key",
    exactMessage: `KeyError: 'username'`,
    metaTitle: "Fix KeyError in Python dict — Cause and Fix",
    metaDescription: "Fix KeyError in Python. Cause, dict.get() pattern, and safe access examples. Free AI Python fixer for KeyError.",
    shortAnswer: "KeyError means you tried to access a dictionary key that does not exist. Use dict.get(key, default) if the key is optional, or check 'key in dict' first if you need to distinguish missing from present-but-None.",
    cause: "Dictionaries raise KeyError when the key is not present, unlike lists which raise IndexError. This is intentional: silent None returns would hide bugs. Keys are case-sensitive and must match exactly — 'Username' and 'username' are different keys.",
    badCode: `user = {"name": "samrat"}\nprint(user["username"])\n# KeyError: 'username'`,
    goodCode: `user = {"name": "samrat"}\n\n# Option 1: .get() with default\nprint(user.get("username", "guest"))\n\n# Option 2: check first (when you need to distinguish missing)\nif "username" in user:\n    print(user["username"])\nelse:\n    print("no username key")\n\n# Option 3: defaultdict\nfrom collections import defaultdict\ncounts = defaultdict(int)\ncounts["missing"] += 1  # works, defaults to 0`,
    steps: [
      "Print list(your_dict.keys()) to see the actual keys",
      "Check for case mismatch — keys are case-sensitive",
      "Use .get(key, default) for optional keys",
      "For nested dicts, chain .get() carefully or use try/except KeyError"
    ],
    faqs: [
      { q: "What is the difference between .get() and []?", a: "[] raises KeyError if the key is missing. .get() returns None (or a specified default). Use [] when the key must exist, .get() when it may not." },
      { q: "How do I safely access nested keys?", a: "Use functools.reduce with .get, or write a helper. In Python 3.11+, try the new sqlite3-style access patterns or use a small recursion." },
      { q: "Why not use setdefault?", a: "setdefault mutates the dict, which can surprise you. .get() is read-only. Prefer .get() unless you specifically want to insert a default." }
    ],
    related: ['indexerror-list-index-out-of-range', 'attributeerror-nonetype-object-has-no-attribute']
  },
  {
    slug: 'importerror-cannot-import-name',
    title: "Fix: ImportError: cannot import name 'X' from 'Y'",
    exactMessage: `ImportError: cannot import name 'foo' from 'mymodule'`,
    metaTitle: "Fix ImportError: cannot import name — Python",
    metaDescription: "Fix ImportError: cannot import name in Python. Cause, circular imports, and step-by-step resolution. Free AI Python fixer.",
    shortAnswer: "ImportError: cannot import name X means Python found the module Y but could not find the name X inside it. The usual causes are a typo in the name, a circular import between two modules, or X is actually defined in a submodule.",
    cause: "Python first locates the module Y on sys.path, then looks up X as an attribute of that module. If X is missing — because of a typo, a different case, a circular import that prevents full initialization, or X lives in a submodule — it raises ImportError.",
    badCode: `from mymodule import foo\n# ImportError: cannot import name 'foo' from 'mymodule'`,
    goodCode: `# Check: is foo actually defined in mymodule?\n# mymodule.py\n# def foo(): ...\n\n# Or if it is in a submodule:\nfrom mymodule.utils import foo\n\n# Or use the module-qualified form to catch missing attrs:\nimport mymodule\nmymodule.foo()`,
    steps: [
      "Open the target module and confirm the name is spelled and cased exactly the same",
      "Check whether the name is defined in a submodule — then import from that submodule",
      "Look for circular imports: module A imports from B, and B imports from A",
      "Print the module's dir() at import time to see what is available"
    ],
    faqs: [
      { q: "How do I fix circular imports?", a: "Move the shared code to a third module both can import, or defer the import inside a function so it happens at runtime instead of at module load." },
      { q: "Why does it work in one file but not another?", a: "sys.path differs between files. A file in a subdirectory may not see the same top-level packages. Use absolute imports from the project root." },
      { q: "Does case matter?", a: "Yes, on Linux and macOS case-sensitive filesystems. 'Foo' and 'foo' are different modules on Linux, unlike Windows." }
    ],
    related: ['modulenotfounderror-no-module-named', 'nameerror-name-is-not-defined']
  },
  {
    slug: 'valueerror-too-many-values-to-unpack',
    title: "Fix: ValueError: too many values to unpack",
    exactMessage: `ValueError: too many values to unpack (expected 2)`,
    metaTitle: "Fix ValueError: too many values to unpack — Python",
    metaDescription: "Fix ValueError: too many values to unpack in Python. Cause, star expressions, and working code examples. Free AI Python fixer.",
    shortAnswer: "ValueError: too many values to unpack occurs when the right side of an unpacking assignment yields more items than the left side expects. Fix by adjusting the number of targets, using *rest to capture extras, or indexing the iterable directly.",
    cause: "Python's tuple unpacking is strict: a, b = iterable requires exactly two values. If iterable has three or more items, it raises this ValueError. The error often appears when unpacking a list of dicts (each dict is one item, not its keys) or after refactoring a function to return more values.",
    badCode: `a, b = (1, 2, 3)\n# ValueError: too many values to unpack (expected 2)`,
    goodCode: `# Option 1: match the count\na, b, c = (1, 2, 3)\n\n# Option 2: star to capture extras\na, b, *rest = (1, 2, 3, 4, 5)\n\n# Option 3: index the items you want\nitems = (1, 2, 3)\na, b = items[0], items[1]`,
    steps: [
      "Print the right side's length or type before the assignment",
      "If a function returns more items than expected, either unpack all of them or index one",
      "Use *rest to accept extras without erroring",
      "If iterating a list of dicts, remember the dict itself is one item, not each key"
    ],
    faqs: [
      { q: "What does *rest do?", a: "*rest captures the remaining items as a list. a, *rest = [1,2,3,4] gives a=1, rest=[2,3,4]. Only one starred target is allowed." },
      { q: "Why does for k, v in dict fail?", a: "Iterating a dict yields keys, not pairs. Use dict.items() to iterate over (key, value) pairs." },
      { q: "What is 'not enough values to unpack'?", a: "The opposite error — the iterable has fewer items than the targets expect. Same fixes apply in reverse." }
    ],
    related: ['indexerror-list-index-out-of-range', 'typeerror-can-only-concatenate-str-not-int-to-str']
  },
  {
    slug: 'syntaxerror-invalid-syntax',
    title: "Fix: SyntaxError: invalid syntax",
    exactMessage: `SyntaxError: invalid syntax`,
    metaTitle: "Fix SyntaxError: invalid syntax in Python",
    metaDescription: "Fix SyntaxError: invalid syntax in Python. Common causes: missing colon, mismatched parentheses, and keyword typos. Free AI Python fixer.",
    shortAnswer: "SyntaxError: invalid syntax means Python could not parse your code at all. The most common causes are a missing colon after if/for/def/class, mismatched brackets, using = instead of == for comparison, or a Python 2 print statement in Python 3.",
    cause: "Unlike runtime errors, SyntaxError happens before any code runs — Python's parser fails on the raw text. The error message often points to the line after the real problem because the parser gets stuck when it hits something unexpected.",
    badCode: `if x > 0\n    print("positive")\n# SyntaxError: invalid syntax`,
    goodCode: `if x > 0:\n    print("positive")`,
    steps: [
      "Read the line number in the error — the real problem is often one or two lines above",
      "Check for missing colons after if, else, for, while, def, class, try, except, finally, with",
      "Verify matching brackets: (), [], {} — count each pair",
      "In Python 3, use print(x) not print x"
    ],
    faqs: [
      { q: "Why does the error point to the wrong line?", a: "Python's parser fails when it sees something unexpected, which is often one line after the real mistake. Always check the line before the reported one." },
      { q: "What is IndentationError vs SyntaxError?", a: "IndentationError is a subtype of SyntaxError specific to indentation. It's a special case worth handling separately." },
      { q: "How do I find the exact problem?", a: "Run python -m py_compile file.py — the parser will point precisely. Or use an IDE like VS Code which highlights syntax live." }
    ],
    related: ['indentationerror-unexpected-indent', 'nameerror-name-is-not-defined']
  },
  {
    slug: 'filenotfounderror-no-such-file-or-directory',
    title: "Fix: FileNotFoundError: No such file or directory",
    exactMessage: `FileNotFoundError: [Errno 2] No such file or directory: 'data.csv'`,
    metaTitle: "Fix FileNotFoundError: No such file or directory — Python",
    metaDescription: "Fix FileNotFoundError: No such file or directory in Python. Cause, working directory gotcha, and code fixes. Free AI Python fixer.",
    shortAnswer: "FileNotFoundError means Python's open() could not find the file at the path you specified. The most common cause is a relative path that resolves against the current working directory, which is rarely the script's folder.",
    cause: "open('data.csv') resolves against os.getcwd(), not the location of the script. So a file next to your script still fails if you run the script from another directory. Absolute paths or pathlib.Path(__file__).parent both avoid this trap.",
    badCode: `with open('data.csv') as f:\n    print(f.read())\n# FileNotFoundError: [Errno 2] ... 'data.csv'`,
    goodCode: `from pathlib import Path\n\n# Resolve relative to the script, not the working directory\nhere = Path(__file__).parent\nwith open(here / 'data.csv') as f:\n    print(f.read())`,
    steps: [
      "Print os.getcwd() to see the actual working directory",
      "Print os.listdir() to confirm the file's location",
      "Use pathlib.Path(__file__).parent to anchor paths to the script file",
      "Avoid hardcoded paths; use environment variables or config files for portability"
    ],
    faqs: [
      { q: "Why does it work in terminal but not in an IDE?", a: "The terminal and the IDE set different working directories. The file path is relative, so it resolves differently. Use absolute paths or pathlib to fix." },
      { q: "How do I fix this in Docker?", a: "Copy the data file into the image with COPY in the Dockerfile. The container's working directory has no access to your host filesystem." },
      { q: "Should I use os.path or pathlib?", a: "pathlib. It is more readable, cross-platform, and available since Python 3.4. The / operator builds paths safely." }
    ],
    related: ['modulenotfounderror-no-module-named', 'importerror-cannot-import-name']
  },
  {
    slug: 'zerodivisionerror-division-by-zero',
    title: "Fix: ZeroDivisionError: division by zero",
    exactMessage: `ZeroDivisionError: division by zero`,
    metaTitle: "Fix ZeroDivisionError: division by zero — Python",
    metaDescription: "Fix ZeroDivisionError in Python. Cause, safe-division pattern, and working examples. Free AI Python fixer.",
    shortAnswer: "ZeroDivisionError occurs when you divide by a number that evaluates to zero. Guard the divisor with an if check, or wrap the division in try/except, or use math.isclose to treat near-zero values as zero.",
    cause: "Python raises ZeroDivisionError whenever the denominator of /, //, or % is zero. Unlike some languages that return inf or NaN, Python raises because silent inf propagates and creates harder-to-find bugs downstream.",
    badCode: `total = 100\ncount = 0\navg = total / count\n# ZeroDivisionError: division by zero`,
    goodCode: `total = 100\ncount = 0\navg = total / count if count else 0\n\n# Or raise a clearer error\ndef safe_div(a, b):\n    if b == 0:\n        raise ValueError("Cannot divide by zero")\n    return a / b`,
    steps: [
      "Trace back to find where the zero divisor came from",
      "Guard the division with 'if divisor != 0'",
      "Decide what the result should be when the divisor is zero (0, None, exception, or inf)",
      "For floats, use math.isclose(divisor, 0.0) to treat near-zero values the same"
    ],
    faqs: [
      { q: "What is the difference between /, //, and %?", a: "All three raise ZeroDivisionError with a zero divisor. / is true division, // floor division, % modulo. None returns inf silently." },
      { q: "Can I make it return inf like NumPy?", a: "Use numpy.divide with errstate ignored, or add a small epsilon. Python's built-in numbers never silently return inf — this is deliberate." },
      { q: "What about modulo by zero?", a: "Same error. 5 % 0 raises ZeroDivisionError. Common in hashing and cyclic-index code — guard with if n:" }
    ],
    related: ['valueerror-too-many-values-to-unpack', 'typeerror-can-only-concatenate-str-not-int-to-str']
  },
];
