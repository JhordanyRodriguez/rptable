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

let RPTableData = class{
    /**
     * 
     * @param {html} html_row 
     */
    constructor(html_row, column_names, abs_index){
        this.row = html_row;
        this.status = 'created';
        // when creating it, if a row is passed, it means that it will be visible.
        this.display = html_row != null ? true: false;
        this.abs_index = abs_index;
        this.sorting_index = abs_index;
        //filter status will be true if the object passess the filter
        this.filter_status = Array.apply(column_names, Array(column_names.length))
                            .map(function(value, index, column_namesi)
                            {
                                //console.log(column_names);
                                //console.log(value);
                                return {"name": column_names[index],"status":true, "index":index}
                            });
        
    }

    passes_filters(){
        return this.filter_status.findIndex((x)=> x.status==false) == -1;
    }

    make_invisible(){
        this.display = false;
        this.row.style.display = 'none';
    }

    make_visible(){
        this.row.style.display = "table-row";
        this.display = true;
    }
}

let RPTable = class{
    /**
     * Returns a table
     * @param {string} html_parent :string the name of the html object the table will be attached to.
     * @param {string} name name
     */
    constructor(html_parent, name)
    {
        if (parent== undefined){
            alert("could not find the parent to create the table");
            return;
        } 
        else
        {
            this.parent = document.getElementById(html_parent);
            this.header_div = document.createElement('div');
            this.header_div.style.position = 'fixed';
            // will have the scroll property
            this.table_container  = document.createElement('div');
            this.table_container.id = 'rptable_container_'+ name;
            this.table_container.classList.add('jrptable_table_content_div');
            this.table_container.style.overflowY= 'scroll';
            // you can overwrite the rows per page.
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
            // pagination
            this.pagination_div = document.createElement('div');
            this.pagination_div.classList.add('rptable_pag_div');
            let pag_button_left = document.createElement('button');
            this.pagination_div.appendChild(pag_button_left);
            let pag_button_right = document.createElement('button');
            this.pagination_div.appendChild(pag_button_right);
            pag_button_left.textContent = "<-"
            pag_button_right.textContent = "->"
            pag_button_left.addEventListener('click', ()=>this.change_view(true));
            pag_button_right.addEventListener('click', ()=>this.change_view(false));
            this.parent.appendChild(this.pagination_div);
        }
        this.name = name;
        this.on_changeview_function = (x)=> console.log('Replace this function, it sends the table as a param');
        
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
        data_row.classList.add('rptable_row');
        return data_row;
    }

    get_current_view(){
        //return this.html_mirror.filter((x)=> x.is_visible() == true);
        return this.html_mirror.filter((x)=> x.display == true)
    }

    change_view(backwards){
        let current_view = this.get_current_view();
        if (current_view.length>0){
            let last_index = current_view.at(-1).sorting_index;
            let first_index = current_view.at(0).sorting_index;
            let next_view = [];
            if (backwards == false)
            {
                // this filter could return when the number of this.rows_per_page elements has been reached.
                next_view = this.html_mirror.filter((x)=> x.sorting_index > last_index && (x.passes_filters()==true));
                // they could not be sorted....
                next_view.sort((x,y)=> x.sorting_index- y.sorting_index);
                next_view = next_view.slice(0, this.rows_per_page);
            }
            else{
                next_view = this.html_mirror.filter((x)=> x.sorting_index < first_index && (x.passes_filters()==true));
                next_view.sort((x,y)=> x.sorting_index - y.sorting_index);
                next_view = next_view.slice(Math.max(next_view.length- this.rows_per_page,0), next_view.length);
            }
            if (next_view.length ==0){
                alert('there is no more data');
                return;
            }
            for (let v =0; v< current_view.length; v++){
                current_view[v].make_invisible();
            }
            console.log('next view is');
            console.log(next_view);
            let to_make_visible = next_view.map((x)=> x.abs_index);
            this.make_indices_visible(to_make_visible);
            this.on_changeview_function(this);
            //? should we do the html swapping here?
        }
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
            this.html_mirror[i] = new RPTableData(data_row, this.column_names,i); 
        }
        
        this.my_top = my_table.my_html.getBoundingClientRect().top;
        setTimeout((x)=> this.re_adjust(), 200);
        window.addEventListener('resize', (x)=> this.re_adjust());
    }

    re_adjust(){
        console.log(this);
        let new_top = this.parent.getBoundingClientRect().bottom +20;
        this.pagination_div.style.top = new_top  +"px";
    }

    /**
     * 
     * @param {Array} to_make_visible: list of absolute indices.
     */
    make_indices_visible(to_make_visible){
        for (let i =0;i< to_make_visible.length; i ++)
        {
            try
            {
                if (this.html_mirror[to_make_visible[i]].row == undefined)
                {
                    // need to create the data row
                    this.html_mirror[to_make_visible[i]].row = this.create_data_row(to_make_visible[i])
                } 
                this.html_mirror[to_make_visible[i]].make_visible();
                // the entry on html_mirror was set to true earlier
            }
            catch(err){
                console.log(err);
                console.log(to_make_visible[i]);
                break;
            }
        }
    }

    comparator_stringss(x,y, myta){
        console.log('these are x and y ');
        
        return 0;
    }

   

    
    show(){
        this.my_html.display='block';
    }
  
};