# Dice.js

A JavaScript implementation of the Sørensen–Dice coefficient.

## Usage

The `dice` object has two main methods:
    
- The `coefficient` method returns an index of similarity for two strings, between 0 and 1.

        dice.coefficient('rabbit season', 'duck season') = 0.545
    
- The `overlap` method returns an array indicating which strings are similar in two sets of strings.

        dice.overlap(['kiss', 'the', 'bride'], ['there', 'is', 'no', 'try']) = [1, 0, null]

    Another example:

        strings input 1 ->  ['AB', 'CD', 'EF', 'GH', 'IJ']
                              0     1     2      3     4
                              |     |     |      |     |
                            [ 0,    2,   null,  null,  3 ]  -> overlap output
                              |      \                /
                              |       `-.          .-'
                              |          \        /
                              0     1     2      3
        strings input 2 ->  ['AA', 'XY', 'CD', 'IJ']

The `dice` object also has two main properties:

- The `multigramLength` property, set to `2` by default.

    To compare two strings, the algorithm splits them in sets of multigrams (sequences of `2` characters by default, called bigrams). For each pair of identical multigrams, the Sørensen–Dice coefficient goes up. You can set `dice.multigramLength` to a higher integer to increase the coefficient's accuracy.

- The `matchMinimum` property, set to `0.5` by default.

    If two strings have a Sørensen–Dice coefficient higher than `0.5`, they are considered similar. You can set `dice.matchMinimum` to a higher value to make the algorithm less tolerant.
