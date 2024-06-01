var my_table = new JTable("table_container", "jtt");
my_table.set_data(reserve_animals);
console.log('set data!')
my_table.create_headers();
console.log('created headers!')
my_table.create_filters(); 
console.log('created filters!');
my_table.set_filter_top();
console.log('set filter top!');
my_table.fill_data();
console.log('filled data!');
my_table.create_sorters()
console.log ('created sorters!')
console.log(reserve_animals);
