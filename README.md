# Unordered diff

Where `diff` compares line by line, `uodiff` checks if a given line is in the other file anywhere.

## Install
```
npm i -g uodiff
```

## Usage
Given two files:

#### fileA
```
diff
hi
whats up?
```

#### fileB
```
hi
whats up?
difference
```

### Run
```
uodiff fileA fileB
```

### Output

3 columns
```
#   = linenumber
-/+ = file indicator
content of the line
```

```
--- testA
+++ testB
1 - diff
3 + difference
```
