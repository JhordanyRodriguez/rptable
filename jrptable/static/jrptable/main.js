var my_table = new JrpTable("table_container", "jtt");
my_table.rows_per_page = 50;
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
my_table.create_sorters()
console.log ('created sorters!')
console.log(reserve_animals);
