# MediSync Project Size Audit

Audit date: 2026-09-28

## Summary

| Area      |   Files | Physical Lines | Code Lines |
| --------- | ------: | -------------: | ---------: |
| Client    |     170 |         29,222 |     24,239 |
| Server    |      99 |         11,791 |      8,900 |
| **Total** | **269** |     **41,013** | **33,139** |

`Code Lines` means physical lines excluding blank lines and comment-only lines.

## Client File Breakdown

| Extension/category |   Files | Physical Lines |     Blank | Comment-only | Code Lines |
| ------------------ | ------: | -------------: | --------: | -----------: | ---------: |
| `.js`              |      46 |          8,528 |     1,111 |          425 |      6,992 |
| `.jsx`             |     105 |         14,916 |     2,213 |          672 |     12,031 |
| `.css`             |      14 |          1,901 |       380 |          161 |      1,360 |
| `.json`            |       2 |          3,821 |         0 |            0 |      3,821 |
| `.html`            |       1 |             24 |         4 |            3 |         17 |
| `.env`             |       1 |              8 |         2 |            3 |          3 |
| `.gitignore`       |       1 |             24 |         2 |            7 |         15 |
| **Total**          | **170** |     **29,222** | **3,712** |    **1,271** | **24,239** |

No client `.ts`, `.tsx`, or other counted source-language files were present.

## Server File Breakdown

| Extension/category |  Files | Physical Lines |     Blank | Comment-only | Code Lines |
| ------------------ | -----: | -------------: | --------: | -----------: | ---------: |
| `.js`              |     96 |          9,768 |     1,958 |          931 |      6,879 |
| `.json`            |      2 |          2,012 |         0 |            0 |      2,012 |
| `.env`             |      1 |             11 |         1 |            1 |          9 |
| **Total**          | **99** |     **11,791** | **1,959** |      **932** |  **8,900** |

No server `.mjs` or `.ts` files were present.

## Excluded Directories and Files

The following were excluded from both recursive scans:

- `node_modules/` dependency and vendor files
- `.git/` repository internals
- `dist/`, `build/`, `coverage/` build and test output
- `.cache/`, `cache/`, `.vite/`, `.next/` and other cache/output directories when present
- `uploads/`, `generated/`, `vendor/`, and `tmp/`/`temp/` directories when present
- Source maps and other generated dependency artifacts within excluded trees

Local non-source assets excluded from the counted totals:

- Client: 5 PNG image assets and 2 TTF font files
- Server: 2 TTF font files

Dependency lockfiles are JSON project metadata and are included in the `.json` totals. Hidden project configuration files such as `.env` and `.gitignore` are included in the `other relevant source/config` totals; their contents were not copied into this report.

No unreadable files were encountered. No symlink traversal was required for the reported counts.

## Methodology

1. Recursively enumerated filesystem files below `client/` and `server/` using a Python 3 read-only script based on `pathlib.Path.rglob()`.
2. Excluded the directories and generated/vendor asset classes listed above before counting.
3. Counted project source/config files by extension. Binary assets, fonts, source maps, and lock-extension files were not treated as source files; JSON lockfiles were included because their actual extension is `.json` and they are project metadata.
4. Read every included file as UTF-8. Files that could not be read would have been listed separately; the unreadable count was zero.
5. Counted physical lines using `splitlines()`. For each file, blank lines were lines whose trimmed content was empty. Comment-only lines were identified from the file language's line/block comment forms. Code lines were calculated as:

   `physical lines - blank lines - comment-only lines`

The counts are filesystem results from the repository state at the audit date, not estimates from the visible editor tree.
