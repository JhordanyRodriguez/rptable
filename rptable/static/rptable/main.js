var my_table = new RPTable("table_container", "jtt", ['id']);
my_table.rows_per_page = 10;
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

function tableEdited(rowID, unIDs, column,newValue, oldValue, object){
    console.log(rowID);
    console.log(unIDs);
    console.log(column);
    console.log(newValue);
    console.log(object);
    console.log('old value was '+ oldValue);
}

let rpEditor = new RPEditor(my_table, tableEdited);
//agg.aggregate();
