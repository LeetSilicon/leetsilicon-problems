# Bug Explanation

The original priority order is:
    else if (shift_en) { shift }
    else if (load)     { load  }
When load=1 and shift_en=1 simultaneously, shift_en wins because it
appears first in the if-else ladder.
Fix: place load before shift_en so parallel load has higher priority.
