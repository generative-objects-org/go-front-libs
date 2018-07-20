# GO UUID library

This library exposes functions enabling UUID (also called GUID) handling in JS.
The following functions are exposed:

## newGuid

`newGuid()` will generate a version 4 (i.e. random) GUID using the Mersenne Twister pseudo-random number generator instead of the built-in `Math.random()` for reasons explained on [this page](https://medium.com/@betable/tifu-by-using-math-random-f1c308c4fd9d).
The returned GUID is a JS string

## isGUID

`isGUID(string)` checks if the given string is a valid GUID (any version).
Returned value is a boolean.

# Resources

-   [Wikipédia page](https://en.wikipedia.org/wiki/Universally_unique_identifier)
-   [GUID Generator](https://guidgenerator.com/)
