var my_table = new RPTable("table_container", "jtt");
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
//agg.aggregate();
