export interface RegexExample {
  slug: string;
  title: string;
  pattern: string;
  metaTitle: string;
  metaDescription: string;
  shortAnswer: string;
  explanation: string;
  goodCode: string;
  badCode: string;
  faqs: { q: string; a: string }[];
  related: string[];
  searchKeywords: string[];
}

export const regexExamples: RegexExample[] = [
  {
    slug: 'email-validation',
    title: "Email Validation Regex (JavaScript & Python)",
    pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`,
    metaTitle: "Email Validation Regex — JavaScript, Python, PHP",
    metaDescription: "The best regex for email validation. Works in JavaScript, Python, PHP, and HTML5. Includes code examples and explanation.",
    shortAnswer: "This regex validates standard email addresses. It ensures there is text before and after the @ symbol, and requires a valid domain extension (like .com or .org).",
    explanation: "The pattern breaks down into three parts: ^[a-zA-Z0-9._%+-]+ matches the username (allowing letters, numbers, dots, etc.), @[a-zA-Z0-9.-]+ matches the domain name, and \\.[a-zA-Z]{2,}$ ensures a valid TLD (Top Level Domain) of at least 2 letters.",
    goodCode: `// JavaScript\nconst emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;\nconsole.log(emailRegex.test("test@example.com")); // true\n\n# Python\nimport re\npattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"\nprint(bool(re.match(pattern, "test@example.com"))) # True`,
    badCode: `// BAD: This allows invalid emails like "test@.com" or "test@com"\nconst badRegex = /.+@.+/;`,
    faqs: [
      { q: "Is this regex 100% accurate for all emails?", a: "No regex is 100% perfect for every edge case of RFC 5322. However, this pattern covers 99.9% of real-world email addresses and is used by most websites." },
      { q: "Why not just use HTML5 type='email'?", a: "HTML5 validation is great for frontend, but you STILL need regex on the backend (Python/PHP/Node) to prevent malicious bypasses." }
    ],
    related: ['password-validation', 'username-validation'],
    searchKeywords: ["regex for email", "email validation regex javascript", "email regex python", "regex email address"]
  },
  {
    slug: 'password-validation',
    title: "Strong Password Validation Regex",
    pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`,
    metaTitle: "Strong Password Regex — Minimum 8 chars, 1 Uppercase",
    metaDescription: "Regex for strong password validation. Requires 8+ characters, uppercase, lowercase, number, and special character. Works in JS, Python, PHP.",
    shortAnswer: "This regex enforces a strong password policy: at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    explanation: "It uses lookaheads: (?=.*[a-z]) checks for a lowercase, (?=.*[A-Z]) for uppercase, (?=.*\\d) for a number, and (?=.*[@$!%*?&]) for a special character. The [A-Za-z\\d@$!%*?&]{8,} ensures the password is at least 8 characters long and only contains allowed characters.",
    goodCode: `// JavaScript\nconst passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;\nconsole.log(passwordRegex.test("Passw0rd!")); // true`,
    badCode: `// BAD: Allows "password" or "12345678"\nconst badRegex = /^.{8,}$/;`,
    faqs: [
      { q: "Why use lookaheads?", a: "Lookaheads allow us to check for the presence of multiple character types anywhere in the string, without consuming characters." },
      { q: "How do I change the minimum length to 12?", a: "Change the {8,} at the end of the regex to {12,}." }
    ],
    related: ['email-validation', 'username-validation'],
    searchKeywords: ["regex for password", "strong password regex", "password validation regex", "regex password uppercase"]
  },
  {
    slug: 'phone-number-us',
    title: "US Phone Number Regex (10 Digits)",
    pattern: `^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$`,
    metaTitle: "US Phone Number Regex — Accepts (555) 123-4567",
    metaDescription: "Regex for US phone numbers. Supports formats like 555-123-4567, (555) 123-4567, and 5551234567.",
    shortAnswer: "This regex matches standard 10-digit US phone numbers. It allows optional parentheses around the area code, and optional dashes, dots, or spaces as separators.",
    explanation: "It breaks down into 3 groups: \\\\(?([0-9]{3})\\\\)? matches the area code with optional parentheses. [-. ]? allows an optional separator (dash, dot, or space). It repeats this for the next 3 digits and the final 4 digits.",
    goodCode: `// JavaScript\nconst usPhoneRegex = /^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;\nconsole.log(usPhoneRegex.test("(555) 123-4567")); // true\nconsole.log(usPhoneRegex.test("555.123.4567")); // true`,
    badCode: `// BAD: Only accepts 555-123-4567 format\nconst badRegex = /^\\d{3}-\\d{3}-\\d{4}$/;`,
    faqs: [
      { q: "Does this handle country codes?", a: "No. This is specifically for 10-digit US/Canada numbers. If you need +1, you must add (\\+?1[-. ]?)? to the start." },
      { q: "What about Indian phone numbers?", a: "Indian numbers are 10 digits but start with 6-9. The regex would be ^[6-9]\\d{9}$." }
    ],
    related: ['phone-number-international', 'email-validation'],
    searchKeywords: ["us phone number regex", "regex phone number", "phone validation regex", "regex for phone"]
  },
  {
    slug: 'url-validation',
    title: "URL / Website Validation Regex (HTTP & HTTPS)",
    pattern: `^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$`,
    metaTitle: "URL Validation Regex — HTTP, HTTPS, and Domains",
    metaDescription: "Regex to validate URLs and website addresses. Supports http, https, and optional www.",
    shortAnswer: "This regex validates HTTP and HTTPS URLs. It ensures the URL starts with a protocol (optional), has a valid domain name, and allows subdirectories.",
    explanation: "^(https?:\\/\\/)? optionally matches 'http://' or 'https://'. ([\\da-z\\.-]+) matches the domain name. \\.([a-z\\.]{2,6}) ensures a valid TLD. The rest allows for paths and query strings.",
    goodCode: `// JavaScript\nconst urlRegex = /^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$/;\nconsole.log(urlRegex.test("https://www.example.com/path")); // true`,
    badCode: `// BAD: Rejects URLs without http://\nconst badRegex = /^https?:\\/\\//;`,
    faqs: [
      { q: "Does this require http:// or https://?", a: "No, the (https?:\\/\\/)? part is optional. It will match 'example.com' as well as 'https://example.com'." },
      { q: "Does it validate IP addresses?", a: "No, this is for domain names. If you need to validate IPs, use a dedicated IPv4 regex." }
    ],
    related: ['email-validation', 'username-validation'],
    searchKeywords: ["url validation regex", "regex for url", "website regex", "regex http https"]
  },
  {
    slug: 'username-validation',
    title: "Username Validation Regex (Alphanumeric + Underscore)",
    pattern: `^[a-zA-Z0-9_]{3,16}$`,
    metaTitle: "Username Regex — Letters, Numbers, Underscore",
    metaDescription: "Regex for username validation. Allows 3 to 16 characters, only letters, numbers, and underscores. No spaces.",
    shortAnswer: "This regex ensures a username is between 3 and 16 characters long, and only contains letters (a-z, A-Z), numbers (0-9), and underscores (_).",
    explanation: "The ^[a-zA-Z0-9_] part defines the allowed characters. The {3,16} defines the length constraints. The $ ensures the entire string matches.",
    goodCode: `// JavaScript\nconst usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;\nconsole.log(usernameRegex.test("samrat_dev")); // true\nconsole.log(usernameRegex.test("sam rat")); // false (contains space)`,
    badCode: `// BAD: Allows spaces and special characters\nconst badRegex = /^.{3,16}$/;`,
    faqs: [
      { q: "How do I allow dots (.) as well?", a: "Add a dot inside the brackets: /^[a-zA-Z0-9_.]{3,16}$/." },
      { q: "How do I prevent usernames from starting with a number?", a: "Change the first bracket to require a letter: /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/." }
    ],
    related: ['password-validation', 'email-validation'],
    searchKeywords: ["username regex", "regex for username", "alphanumeric regex", "username validation"]
  },
  {
    slug: 'date-format-yyyy-mm-dd',
    title: "Date Format Regex (YYYY-MM-DD)",
    pattern: `^\\d{4}-\\d{2}-\\d{2}$`,
    metaTitle: "Date Regex YYYY-MM-DD — ISO 8601 Format",
    metaDescription: "Regex to validate dates in YYYY-MM-DD format (ISO 8601). Includes JavaScript and Python examples.",
    shortAnswer: "This regex validates the structure of a date in YYYY-MM-DD format. It checks for 4 digits, a dash, 2 digits, a dash, and 2 digits.",
    explanation: "\\d{4} matches the year. - matches the dash. \\d{2} matches the month and day. Note: This only validates the format, not the actual calendar validity (e.g., it will match 2026-99-99).",
    goodCode: `// JavaScript\nconst dateRegex = /^\\d{4}-\\d{2}-\\d{2}$/;\nconsole.log(dateRegex.test("2026-11-14")); // true`,
    badCode: `// BAD: Accepts invalid formats like 14-11-2026\nconst badRegex = /^\\d{2}-\\d{2}-\\d{4}$/;`,
    faqs: [
      { q: "Does this regex check if the date actually exists?", a: "No. Regex only validates format. To check if '2026-02-30' is a real date, you must use a Date library (like date-fns or Python's datetime)." },
      { q: "How do I allow DD/MM/YYYY?", a: "Swap the groups: /^\\d{2}\\/\\d{2}\\/\\d{4}$/" }
    ],
    related: ['email-validation', 'url-validation'],
    searchKeywords: ["date regex", "regex for date", "yyyy-mm-dd regex", "date validation regex"]
  },
  {
    slug: 'ipv4-address',
    title: "IPv4 Address Regex",
    pattern: `^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$`,
    metaTitle: "IPv4 Regex — Match Valid IP Addresses (0.0.0.0 to 255.255.255.255)",
    metaDescription: "Regex for IPv4 addresses. Ensures each octet is between 0 and 255. Works in all languages.",
    shortAnswer: "This regex validates IPv4 addresses. It ensures that each of the four numbers is between 0 and 255, separated by dots.",
    explanation: "The pattern repeats 4 times, separated by dots. (?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?) matches numbers from 250-255, 200-249, and 0-199 respectively.",
    goodCode: `// JavaScript\nconst ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;\nconsole.log(ipv4Regex.test("192.168.1.1")); // true\nconsole.log(ipv4Regex.test("999.1.1.1")); // false`,
    badCode: `// BAD: Matches 999.999.999.999\nconst badRegex = /^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/;`,
    faqs: [
      { q: "Does this validate IPv6?", a: "No. IPv6 uses hexadecimal and colons (e.g., 2001:0db8:85a3::8a2e:0370:7334). It requires a completely different regex." }
    ],
    related: ['url-validation', 'email-validation'],
    searchKeywords: ["ipv4 regex", "ip address regex", "regex for ip", "validate ipv4"]
  },
  {
    slug: 'html-tag-stripper',
    title: "Remove HTML Tags Regex",
    pattern: `<[^>]*>`,
    metaTitle: "Regex to Remove HTML Tags from String",
    metaDescription: "Regex pattern to strip HTML tags from a string. Useful for plain text extraction in JavaScript, Python, and PHP.",
    shortAnswer: "This simple regex matches any HTML tag, allowing you to replace it with an empty string to extract plain text.",
    explanation: "< matches the opening bracket. [^>]* matches any character that is NOT a closing bracket. > matches the closing bracket. This effectively grabs <div>, <p class='x'>, <br/>, etc.",
    goodCode: `// JavaScript\nconst html = "<p>Hello <b>World</b></p>";\nconst text = html.replace(/<[^>]*>/g, "");\nconsole.log(text); // "Hello World"`,
    badCode: `// BAD: Misses tags with line breaks\nconst badRegex = /<.*>/;`,
    faqs: [
      { q: "Is it safe to use this for security (XSS prevention)?", a: "NO. Never use regex to sanitize HTML for security. Use a dedicated library like DOMPurify. This is only for simple text extraction." }
    ],
    related: ['email-validation', 'url-validation'],
    searchKeywords: ["regex remove html tags", "strip html tags regex", "html tag regex", "regex replace html"]
  },
  {
    slug: 'whitespace-removal',
    title: "Remove All Whitespace Regex",
    pattern: `\\s+`,
    metaTitle: "Regex to Remove Spaces and Whitespace",
    metaDescription: "Regex pattern to remove all whitespace (spaces, tabs, newlines) from a string.",
    shortAnswer: "This regex matches one or more whitespace characters. Replacing it with an empty string removes all spaces from the text.",
    explanation: "\\s matches any whitespace character (space, tab, newline). The + makes it match consecutive whitespaces together, which is more efficient than replacing them one by one.",
    goodCode: `// JavaScript\nconst str = "Hello   World!\\n";\nconst clean = str.replace(/\\s+/g, "");\nconsole.log(clean); // "HelloWorld!"`,
    badCode: `// BAD: Only removes standard spaces, leaves tabs and newlines\nconst badRegex = / /g;`,
    faqs: [
      { q: "How do I remove only spaces, but keep newlines?", a: "Use /[ \\t]+/g instead of \\s+, or replace spaces specifically: / +/g." }
    ],
    related: ['html-tag-stripper', 'username-validation'],
    searchKeywords: ["remove whitespace regex", "regex remove spaces", "strip spaces javascript", "regex replace space"]
  },
  {
    slug: 'hex-color-code',
    title: "Hex Color Code Regex (CSS)",
    pattern: `^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$`,
    metaTitle: "Hex Color Regex — Match #FFFFFF or #FFF",
    metaDescription: "Regex for validating hex color codes. Supports 3-digit and 6-digit formats with optional hash.",
    shortAnswer: "This regex matches standard CSS hex color codes. It allows an optional # symbol, followed by either 6 hex characters or 3 shorthand hex characters.",
    explanation: "^#? matches an optional hash. ([a-fA-F0-9]{6}|[a-fA-F0-9]{3}) matches either 6 characters or 3 characters. The $ ensures the entire string is just the color code.",
    goodCode: `// JavaScript\nconst hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;\nconsole.log(hexRegex.test("#ffffff")); // true\nconsole.log(hexRegex.test("000")); // true\nconsole.log(hexRegex.test("#gggggg")); // false`,
    badCode: `// BAD: Doesn't allow 3-digit shorthand colors like #fff\nconst badRegex = /^#[a-fA-F0-9]{6}$/;`,
    faqs: [
      { q: "Does this handle RGBA?", a: "No, RGBA uses a different format like rgba(255, 255, 255, 0.5). This regex is only for hex codes." }
    ],
    related: ['html-tag-stripper', 'email-validation'],
    searchKeywords: ["hex color regex", "color code regex", "regex hex", "validate hex color"]
  }
];
