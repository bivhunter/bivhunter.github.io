"use strict";



//перемешивание таблици
function mixTable(table) {
    let trList = table.getElementsByTagName("tr");
    let trArr = [].slice.call(trList, 1);
    // сортировка в случайном порядке
    trArr.sort((tr1, tr2) => {
        let numRandom = Math.floor(Math.random() - 0.5);
        return numRandom;
    });

    for (let i = 0; i < trArr.length; i++) {
        table.appendChild(trArr[i]);
    }
}

//рассширение таблицы до num строк
function creatManyCopy(table, num) {
    let trList = table.getElementsByTagName("tr");
    for (let i = 0; i < num; i++) {
        let newTr = trList[i % 3 + 1].cloneNode(true);
        let numRandom = Math.round(Math.random() * 60);
        let td = document.createElement("td");

        td.textContent = numRandom + "";
        newTr.replaceChild(td, newTr.children[3]);
        table.appendChild(newTr);
    }
}

//выбор колонки по строке заголовка, если нет то возвращает error
function getNumColumn(table, nameColumn) {
    let thList = table.getElementsByTagName("th");
    for (let i = 0; i < thList.length; i++) {
        if (thList[i].textContent === nameColumn) {
            return i;
        }
    }
    return "error";
}

//создание масива строк с таблици
function createTrArr(table) {
    let trList = table.getElementsByTagName("tr");
    return [].slice.call(trList);
}

//показ таблицы с масива строк
function showTrArr(table, trArr) {
    table.append(...trArr);
}

//порівняння двух радків
function compareStr(str1, str2) {
    if (isFinite(str1) && isFinite(str2)) {
        return +str1 > +str2 ? true : false;
    } else {
        return str1.localeCompare(str2) > 0 ? true : false;
    }
}

//зміна місцями двох елементів масива
function swapElem(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

//сортировка по функции func таблицы table, по заголовку str, вывод таблицы
function sortAlg(func, table, nameColumn) {
    let arr = createTrArr(table);
    let numColumn = getNumColumn(table, nameColumn);
    //Перевірка існування стовбчика
    if (numColumn === "error") {
        alert("Нема колонки з такою назвою");
        return "error";
    }
    //Масив рядків без першого
    let trArr = [].slice.call(arr, 1);
    //сортування функціею func
    func(trArr, numColumn);

    //добавляем строку заголовки в отсортированый масив
    trArr.splice(0, 0, arr[0]);
    //console.log(trArr);
    showTrArr(table, trArr);
}

//функція сортування вбудованим методом sort по номеру стовбчика
function builtInSort(trArr, numColumn) {
    trArr.sort((tr1, tr2) => {
        //если значение число, то сравниваем как числа иначе как строки
        if (isFinite(tr1.children[numColumn].textContent)) {
            return tr1.children[numColumn].textContent - tr2.children[numColumn].textContent;
        } else {
            return tr1.children[numColumn].textContent.localeCompare(tr2.children[numColumn].textContent);
        }
    });
}

//сортировка масива строк алгоритмом бульки по номеру колонки
//самій медленный
function bubbleSort(trArr, numColumn) {
    let end = true;
    let len = trArr.length;
    //console.log(len);
    while (end) {
        //console.log(end);
        end = false;
        for (let i = 0; i < len - 1; i++) {
            let td1 = trArr[i].children[numColumn].textContent;
            let td2 = trArr[i + 1].children[numColumn].textContent;
            if (compareStr(td1, td2)) {
                swapElem(trArr, i, i + 1);
                end = true;
            }
        }
        len--;
    }
}

//сортировка масива строк алгоритмом шейкер по заголовку колонки
function shakeSort(trArr, numColumn) {
    let work = true;
    let end = trArr.length;
    let start = 0;
    //console.log(len);
    while (work) {
        //console.log(end);
        work = false;
        for (let i = start; i < end - 1; i++) {
            let td1 = trArr[i].children[numColumn].textContent;
            let td2 = trArr[i + 1].children[numColumn].textContent;
            if (compareStr(td1, td2)) {
                swapElem(trArr, i, i + 1);
                work = true;
                //console.log(trArr);
            }
        }
        end--;
        for (let i = end; i > start; i--) {
            let td1 = trArr[i].children[numColumn].textContent;
            let td2 = trArr[i - 1].children[numColumn].textContent;
            if (compareStr(td2, td1)) {
                swapElem(trArr, i, i - 1);
                work = true;
                //console.log(trArr);
            }
        }
        start++;
    }
}

//сортировка масива строк алгоритмом втавки по заголовку колонки
function insertionSort(trArr, numColumn) {

    let len = trArr.length;
    for (let i = 1; i < len; i++) {
        for (let j = i; j > 0; j--) {
            let td1 = trArr[j].children[numColumn].textContent;
            let td2 = trArr[j - 1].children[numColumn].textContent;
            if (compareStr(td2, td1)) {
                swapElem(trArr, j, j - 1);
            } else {
                break;
            }
        }
    }
}

//сортировка масива строк алгоритмом расчески по заголовку колонки
function comboSort(trArr, numColumn) {
    //Оптимальний коефіціент для даного методу
    const k = 1.2473309;
    let step = trArr.length - 1;
    let stepTemp = step;

    while (step > 1) {
        for (let i = 0; i < trArr.length - step; i++) {
            let td1 = trArr[i].children[numColumn].textContent;
            let td2 = trArr[i + step].children[numColumn].textContent;
            if (compareStr(td1, td2)) {
                swapElem(trArr, i, i + step);
            }
        }

        stepTemp = stepTemp / k;
        step = Math.round(stepTemp);
    }
}

//сортировка масива строк алгоритмом Шела последоватльность Седжвика по заголовку колонки
function shellSedjwickSort(trArr, numColumn) {
    let stepArr = [];
    let step = 1;
    let len = trArr.length;
    let j = 1;

    //создание последовательности Седжвика 
    while (step * 3 < len) {
        stepArr.push(step);
        if (j % 2 === 0) {
            step = 9 * Math.pow(2, j) - 9 * Math.pow(2, j / 2) + 1;
        } else {
            step = 8 * Math.pow(2, j) - 6 * Math.pow(2, (j + 1) / 2) + 1;
        }
        j++;
    }
    //console.log(stepArr);


    for (let i = stepArr.length - 1; i >= 0; i--) {
        let step = stepArr[i];
        for (let j = step; j < len; j++) {
            for (let l = j; l >= step; l -= step) {
                let td1 = trArr[l].children[numColumn].textContent;
                let td2 = trArr[l - step].children[numColumn].textContent;
                if (compareStr(td2, td1)) {
                    swapElem(trArr, l, l - step);
                } else {
                    break;
                }
            }
        }
    }
}

//дурне сорторування, гномяче
function gnomeSort(trArr, numColumn) {
    let len = trArr.length;
    let i = 1;
    while (i < len) {
        if (i === 0) {
            i++;
        }
        let td1 = trArr[i].children[numColumn].textContent;
        let td2 = trArr[i - 1].children[numColumn].textContent;
        if (compareStr(td1, td2) || td1 === td2) {
            i++;
        } else {
            swapElem(trArr, i, i - 1);
            i--;
        }
    }
}

//сортування вибором на рівні змійки та гнома
function selectionSort(trArr, numColumn) {
    let len = trArr.length;

    for (let i = 0; i < len - 1; i++) {
        let td_i = trArr[i].children[numColumn].textContent;
        let min = td_i;
        let index;
        for (let j = i + 1; j < len; j++) {
            let td_j = trArr[j].children[numColumn].textContent;
            if (compareStr(min, td_j)) {
                min = td_j;
                index = j;
            }
        }
        if (compareStr(td_i, min)) {
            swapElem(trArr, i, index);
        }
    }
}

//швидке сортування
function quickSort(trArr, numColumn) {
    let len = trArr.length;

    function qSort(left, right) {
        let l = left;
        let r = right;
        let index = Math.floor((l + r) / 2);
        let td_Index = trArr[index].children[numColumn].textContent;

        while (l <= r) {
            let td_l = trArr[l].children[numColumn].textContent;

            while (compareStr(td_Index, td_l)) {
                l++;
                td_l = trArr[l].children[numColumn].textContent;
            }

            let td_r = trArr[r].children[numColumn].textContent;
            while (compareStr(td_r, td_Index)) {
                r--;
                td_r = trArr[r].children[numColumn].textContent;
            }

            if (l <= r) {
                swapElem(trArr, l, r);
                l++;
                r--;
            }
        }

        if (left < r) {
            qSort(left, r);
        }

        if (l < right) {
            qSort(l, right);
        }
    }

    qSort(0, len - 1);
}
/* Сортировка, создание масива с таблицы, сортировка, создание таблицы
и ее вывод б
быстрее буляк, но медленней других методов

}*/
function sort_1(table, nameColumn) {
    function createArr(table) {
        let trArr = [];

        let trList = table.querySelectorAll("tr");
        for (let i = 1; i < trList.length; i++) {
            let tdArr = [];
            let tdList = trList[i].getElementsByTagName("td");
            for (let j = 0; j < tdList.length; j++) {
                tdArr.push(tdList[j].textContent);
            }
            trArr.push(tdArr);
        }
        return trArr;
    }

    function sortTableArr(trArr, numColumn) {
        let resArr = trArr.slice();
        resArr.sort((arr1, arr2) => {
            if (isFinite(arr1[numColumn]) && isFinite(arr2[numColumn])) {
                return +arr1[numColumn] - +arr2[numColumn];
            } else {
                return arr1[numColumn].localeCompare(arr2[numColumn]);
            }
        });
        return resArr;
    }

    function showTableArr(table, arr) {
        let trList = table.querySelectorAll("tr");
        for (let i = 1; i < trList.length; i++) {
            let tr = document.createElement("tr");
            let str = "";
            for (let j = 0; j < arr[i - 1].length; j++) {
                str += `<td>${arr[i - 1][j]}</td>`;
            }
            tr.insertAdjacentHTML("afterBegin", str);
            trList[i].parentNode.replaceChild(tr, trList[i]);
        }
    }


    let arr = createArr(table);
    let numColumn = getNumColumn(table, nameColumn);
    if (numColumn === "error") {
        alert("нет колонки с таким заголовком");
        return "error";
    }

    let arrSorted = sortTableArr(arr, numColumn);
    showTableArr(table, arrSorted);
}

// Сортировка встроенім методом sort
// Самый быстрый
function sort_2(table, nameColumn) {
    sortAlg(builtInSort, table, nameColumn);
}

//Сортировка таблицы алгоритмом бульки
function sort_Bubble(table, nameColumn) {
    sortAlg(bubbleSort, table, nameColumn);
}

//Сортировка таблицы алгоритмом змейка
function sort_Shake(table, nameColumn) {
    sortAlg(shakeSort, table, nameColumn);
}

//Сортировка таблицы алгоритмом вставки
function sort_Insartion(table, nameColumn) {
    sortAlg(insertionSort, table, nameColumn);
}

//Сортировка таблицы алгоритмом расческа
function sort_Combo(table, nameColumn) {
    sortAlg(comboSort, table, nameColumn);
}

//Сортировка таблицы алгоритмом Шела последовательностью Седжвика
function sort_ShellSedjwick(table, nameColumn) {
    sortAlg(shellSedjwickSort, table, nameColumn);
}

//дурне сорторування, гномяче
function sort_Gnome(table, nameColumn) {
    sortAlg(gnomeSort, table, nameColumn);
}

//сортування вибором на рівні змійки та гнома
function sort_Selection(table, nameColumn) {
    sortAlg(selectionSort, table, nameColumn);
}

//швидке сортування
function sort_Quick(table, nameColumn) {
    sortAlg(quickSort, table, nameColumn);
}
/*
сортировка таблиці находу, при увеличении строк тормозит
function sort_Bubble_2(table) {
    let trList = table.getElementsByTagName("tr");
    let fragment = document.createDocumentFragment();
    trList = fragment.getElementsByTagName("tr");
    fragment.append(...trList);
    let end = false;
    let len = trList.length;
    while (!end) {
        end = true;
        for (let i = 1; i < len - 1; i++) {
            if (+trList[i].children[3].textContent >
                +trList[i + 1].children[3].textContent) {
                trList[i + 1].insertAdjacentElement("afterEnd", trList[i]);
                end = false;
                trList = fragment.getElementsByTagName("tr");
            }
        }
        len--;
    }
}*/

function timer(func, table, str) {
    let start = new Date();
    func(table, str);
    return new Date() - start;
}

function timerMany(table, nameColumn, times, ...func) {
    let funcArr = [].slice.call(arguments, 3);
    let resArr = [];
    let resStr = "";
    for (let i = 0; i < funcArr.length; i++) {
        resArr[i] = 0;
    }

    for (let j = 0; j < times; j++) {
        for (let i = 0; i < funcArr.length; i++) {
            mixTable(table);
            resArr[i] += timer(funcArr[i], table, nameColumn);
        }
    }

    for (let i = 0; i < resArr.length; i++) {
        resStr += funcArr[i].name + " = " + resArr[i] + " \n";
    }

    return resStr;
}

let table = document.getElementById("table");
creatManyCopy(table, 50000);

//sort_Quick(table, "Вік");

let res = timerMany(table, "Вік", 5,
    //sort_1,
    sort_2
    //sort_Bubble,
    //sort_Shake,
    //sort_Combo,
    //sort_Insartion,
    //sort_ShellSedjwick
    //sort_Gnome,
    //sort_Selection,
    //sort_Quick
);

alert(res);



//  console.log(trArr);
/*console.log(sortTrArr(trArr, "Вік"));

showTrArr(table, sortTrArr(trArr, "Вік"));

showTrArr(table, trArr);*/

/*console.log(sortTableArr(arr, 4));
showTableArr(table, arr);*/