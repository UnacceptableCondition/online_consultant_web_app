/* exported sorter */
var sorter = (function createNewSorter () {
    function Sorter() {}

    function createSorter() {
        return new Sorter();
    }

    function swap(items, firstIndex, secondIndex) {
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    function partition(items, left, right, sortField) {
        var pivot = items[Math.floor((right + left) / 2)][sortField];
        var i = left;
        var j = right;

        while (i <= j) {
            while (items[i][sortField] > pivot) {
                i++;
            }
            while (items[j][sortField] < pivot) {
                j--;
            }
            if (i <= j) {
                swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    Sorter.prototype.quickSort = function quickSort(
        items,
        left,
        right,
        sortField
    ) {
        var index;
        if (items.length > 1) {
            index = partition(items, left, right, sortField);
            if (left < index - 1) {
                this.quickSort(items, left, index - 1, sortField);
            }
            if (index < right) {
                this.quickSort(items, index, right, sortField);
            }
        }
        return items;
    };

    return createSorter();
})();