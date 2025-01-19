var my_table = new RPTable("table_container", "jtt", ['id']);
my_table.rowsPerPage = 10;
my_table.set_data(reserve_animals);
console.log('set data!')
my_table.create_headers();
console.log('created headers!')
create_filters(my_table); 
console.log('created filters!');
set_filter_top();
console.log('set filter top!');
my_table.fill_data();
console.log('filled data!');
create_sorters(my_table);
console.log ('created sorters!')
console.log(reserve_animals);
let agg = new RPTableAgg(my_table);
let graph = null;


/**
 * A sample call back function for when the table is edited. You can rewrite this
 * function to make call to back end apis, or to trigger any event of your liking.
 * @param {String} rowID 
 * @param {*} unIDs 
 * @param {*} column 
 * @param {*} newValue 
 * @param {*} oldValue 
 * @param {*} object 
 */
function tableEdited(rowID, unIDs, column,newValue, oldValue, object){
    console.log(rowID);
    console.log(unIDs);
    console.log(column);
    console.log(newValue);
    console.log(object);
    console.log('old value was '+ oldValue);
}

/**
 * function called after all HTML elements are loaded.
 * It selects the div with id 'canvas_div' and places the grapher in there.
 * @param {RPTable} rptable 
 */
function create_graph(rptable){
    let theDiv = document.getElementById('canvas_div');
    graph = new RPgraph(rptable, theDiv);
    graph.horizontalSelect.value = "3"
    graph.createNewChart(graph.horizontalProperty);

}

let rpEditor = new RPEditor(my_table, tableEdited);

document.addEventListener('DOMContentLoaded', (e)=> create_graph(my_table));
//agg.aggregate();
