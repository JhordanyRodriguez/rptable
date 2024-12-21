//https://www.w3schools.com/jsref/dom_obj_table.asp
/**
 * creates an input with id 'input_in__x' where x is id of html_cell
 * @param {html} html_cell the html object to which an input will be added.
 * @param {string} classes_to_apply A class that will be assigned to the inputs created
 */
function add_input_to_cell(html_cell, classes_to_apply){
    let my_input = document.createElement('input');
    classes_to_apply.forEach(x=> my_input.classList.add(x));
    //my_input.classList.add(class_to_apply);
    my_input.id = 'input_in__'+ html_cell.id;
    my_input.setAttribute('current_runs',0);
    html_cell.appendChild(my_input);
    return my_input;
}

let JrpTableData = class{
    /**
     * 
     * @param {html} html_row 
     */
    constructor(html_row, column_names){
        this.row = html_row;
        this.status = 'created';
        this.display = html_row != null ? true: false;
        //filter status will be true if the object passess the filter
        this.filter_status = Array.apply(column_names, Array(column_names.length))
                            .map(function(value, index, column_namesi)
                            {
                                //console.log(column_names);
                                //console.log(value);
                                return {"name": column_names[index],"status":true, "index":index}
                            });
        
    }

}

let JrpTable = class{
    /**
     * Returns a table
     * @param {string} html_parent :string the name of the html object the table will be attached to.
     * @param {string} name name
     */
    constructor(html_parent, name){
        if (parent== undefined){
            alert("could not find the parent to create the table");
            return;
        } 
        else
        {
            this.parent = document.getElementById(html_parent);
            this.header_div = document.createElement('div');
            this.header_div.style.position = 'fixed';
            //this.header_div.textContent= 'holaaa';
            this.table_container  = document.createElement('div');
            this.table_container.classList.add('jrptable_table_content_div');

            this.table_container.style.overflowY= 'scroll';
            this.rows_per_page =60;
            this.my_html = document.createElement('TABLE');
            this.header_div.my_html = document.createElement('TABLE');
            this.header_div.my_html.setAttribute('table-layout','fixed');
            this.header_div.appendChild(this.header_div.my_html);
            this.table_container.appendChild(this.my_html);
            this.my_html.id = 0;
            this.columns_info = [];
            this.my_html.classList.add('jrptable_table');
            this.header_div.my_html.classList.add('jrptable_table');
            this.header = null;
            this.parent.appendChild(this.header_div);
            this.parent.appendChild(this.table_container);
        }
        this.name = name;
        
    };

    /**
     * sets the data that will be displayed by this instance.
     * @param {list[json]} data 
     */
    set_data(data)
    {
        this.data = data;
        this.column_names = Object.keys(this.data[0]);
        this.columns_info = Array.apply(this.column_names, Array(this.column_names.length)).map(function(x,i){
                                                                                return {"index": i,
                                                                                        "name": x,
                                                                                        "type":"string"};
                                                                                    });
        let reduced_data = this.data.slice(0,600);                                                                           
        for (let c =0; c < this.column_names.length; c ++){
            let this_column = this.column_names[c];
            let no_number = reduced_data.findIndex((x)=> isNaN(parseFloat(x[this_column])));
            if (no_number == -1){
                this.columns_info[c].type = "number";   
            }
            this.columns_info[c].name = this.column_names[c];
        }
        // simple array that will make it easier to map the filters results
        this.indices = Array.apply(null, Array(this.data.length)).map(function(x,i){return i;});
        // an array that will contain the order in which rows will be shown.
        this.ordered_indices = Array.apply(null, Array(this.data.length)).map(function(x,i){return i;});
        
    }

    /**
     * Creates the html structure of the headers to display the data.
     * maps every field of the first element in the list data
     * to a column, then displays the columns for each element
     * in the list data.
     * populates attributes: column_names, header
     * @param {list[json]} data 
     */
    create_headers()
    {        
        console.log(this.column_names);
        this.header = this.my_html.createTHead();
        
        this.header_div.classList.add('jrptable_header_mirror');
        let header_row = this.header.insertRow(0);
        let column_width = 100/this.column_names.length;
        
        for (let i =0; i < this.column_names.length; i ++){
            var th = document.createElement('th');
            th.classList.add('jrptable_header');
            th.innerHTML = this.column_names[i];            
            //let td = header_row.insertCell();
            th.id = this.name +"__header__"+this.column_names[i];
            header_row.appendChild(th);
            
        }
    }


    /**
     * creates an html row
     * @param {int} index_in_data the index within the original array 
     * of the data point we want to create the html row for
     */
    create_data_row(index_in_data){
        // where are we inserting it
        let data_row = this.tbody.insertRow();
        for (let f =0; f < this.column_names.length; f++)
        {
            let td = data_row.insertCell();
            td.innerHTML = this.data[index_in_data][this.column_names[f]];                
        }
        data_row.setAttribute('dindex', index_in_data);
        return data_row;
    }

   
    /**
     * It also creates attribute 'html_mirror'. Entry ith in html_mirror holds the 
     * html data corresponding to the ith entry in the original data. i.e, we have
     * a one to one index-based mapping between the original data and html_mirror
     */
    fill_data(){
        // create a placeholder element:
        this.html_mirror = Array.apply(null, Array(this.data.length)).map(function () {})
        // now we fill the data 
    
        this.tbody = document.createElement('tbody');
        this.my_html.appendChild(this.tbody);
        
        for (let i =0; i <this.data.length; i ++)
        {
            let data_row = null;
            if (i < this.rows_per_page)
            {
                data_row = this.create_data_row(i);
            }
            // rows that will not be shown, data_row, will be set to null
            this.html_mirror[i] = new JrpTableData(data_row, this.column_names); 
        }
        
        this.my_top = my_table.my_html.getBoundingClientRect().top;
    }

    comparator_stringss(x,y, myta){
        console.log('these are x and y ');
        
        return 0;
    }
    compare_strings(x,y){
        //console.log('comparing ');
        if (x<y){
            return -1;
        }
        else if(x>y){
            return 1;
        }
        else{
            return 0;
        }
    }

  

    obtain_sorter(column_name, column_index)
    {
        
        let column_info = this.columns_info[column_index];
        console.log('this is the column info ');
        console.log(column_info);
        // the indices of the original data to consider
        let toConsider =Array.apply(null, Array(this.data.length)).map(function(x,i){return i;});
        toConsider = toConsider.filter((i) => this.html_mirror[i].filter_status.find(x=>x.status == false) == undefined);
        console.log('to consider');
        console.log(toConsider);
        let before_ordering = Array.apply(null,
                                          toConsider.filter(x => x!= undefined))

        let comparing_strings= (x,y)=> this.compare_strings(this.data[x][column_name],
                                                            this.data[y][column_name]);
        //this.ordered_indeces.sort((x,y)=> this.comparator_strings(x,y, this));
        toConsider.sort((x,y)=> comparing_strings(x,y));
        console.log('this is the new order');
        console.log(toConsider);
        console.log('this is the previous ');
        console.log(before_ordering);
        let parent_node = my_table.html_mirror[0].row.parentNode;
        //every time there is a swap, the previous indixes get pushed one down.
        // e.g if 6 is the first element now, we have 
        // 6,0,1,2,3 ... the second entry will need to be compared swapped with 0, not 1
        let n_swaps =0;
        // only do the elements in the current page. toConsider only has
        // the ones that passed the filters.
        let limit = Math.min(toConsider.length, this.rows_per_page);
        for (let i =0; i < limit; i ++){
            if (toConsider[i] != toConsider[i-n_swaps] | 4>3)
            {
                console.log('will swap  '+ toConsider[i] + ' with '+ before_ordering[i]);
                if (this.html_mirror[toConsider[i]].row == null){
                    this.html_mirror[toConsider[i]].row = this.create_data_row(toConsider[i])
                }
                parent_node.insertBefore(this.html_mirror[toConsider[i]].row,
                                         this.html_mirror[before_ordering[i-n_swaps]].row)
                n_swaps++;
    
            }
            
           // this.html_mirror[i].row.insertBefore()
        }
       
        
    }

    my_sorter(column_name){
        alert(' will sort '+ column_name);
    }
    
    

    create_sorters(){
        let sortable_columns = this.column_names.filter((x)=> x != undefined);
        for (let i =0; i < sortable_columns.length; i ++)
        {
            let icolumn_name = this.column_names[i].replace(' ','_');
            let _sorter_id = this.name +"__mheader__"+icolumn_name;
            // this sorted id will need to refer to the newly created header_div
            let _header = document.getElementById(_sorter_id);
            if (_header != undefined){
                console.log('adding click listener to '+ _sorter_id);
                //_header.addEventListener('click', this.obtain_sorter(icolumn_name));
                _header.addEventListener('click',
                                         (e)=> this.obtain_sorter(icolumn_name, i));
            }
            else{
                console.log('could not find header with id '+ _sorter_id);
            }
            
        }
    }



    show(){
        this.my_html.display='block';
    }

    add_column_header_listeners(){
        for(let i =0; i <this.column_names; i ++){

        }
    }
};

