var my_table = new JTable("table_container", "cosa");
my_table.set_data(reserve_animals);
my_table.create_headers();
my_table.create_filters(); 
my_table.fill_data();
console.log(reserve_animals);