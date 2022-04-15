//https://www.w3schools.com/jsref/dom_obj_table.asp

let JTable = class{
    /**
     * Returns a table
     * @param {string} html_parent :string the name of the html object the table will be attached to.
     * @param {string} name name
     */
    constructor(html_parent, name){
        let parent = document.getElementById(html_parent);
        this.rows_per_page =60;
        if (parent== undefined){
            alert("could not find the parent to create the table");
        } 
        else
        {
            this.my_html = document.createElement('TABLE');
            parent.appendChild(this.my_html);
            this.my_html.id = 0;
            this.column_headers = [];
            this.my_html.classList.add('jtable_table');
            this.header = null;
        }
    };

    /**
     * sets the data that will be displayed by this instance.
     * @param {list[json]} data 
     */
    set_data(data){
        this.data = data;
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
        this.column_names = Object.keys(this.data[0]);
        console.log(this.column_names);
        this.header = this.my_html.createTHead();
        let header_row = this.header.insertRow(0);
        
        for (let i =0; i < this.column_names.length; i ++){
            var th = document.createElement('th');
            th.classList.add('jtable_header');
            th.innerHTML = this.column_names[i];            
            //let td = header_row.insertCell();
            th.id = this.name +"__header__"+this.column_names;
            header_row.appendChild(th);          
        }
    }

    /**
     * set the top of the filter based on how much space is being consumed
     * by the headers. At the moment we have 
     * top_filters = 2* height_headers_rect + 5 px
     */
    set_filter_top(){
        // we get the bottom of the headers row
        let headers = document.getElementsByClassName("jtable_header");
        if (headers != undefined && headers.length > 0){
            let first_header_bottom = headers[0].getBoundingClientRect().bottom;
            let first_header_top = headers[0].getBoundingClientRect().top;
            let new_top = (first_header_bottom - first_header_top)*2 +5;
            let filters = document.getElementsByClassName("jtable_filter");
            if (filters != undefined){
                for (let i=0; i < filters.length; i ++){
                    console.log('adjusting filters lenght '+ first_header_bottom);
                    filters[i].style.top = new_top+ "px";
                }
            }
        }
    }

    create_filters()
    {
        
        
        this.filter_row =this.header.insertRow(1);
        console.log('inserted row filter');
        for (let i =0; i < this.column_names.length; i ++)
        {
            var th = document.createElement('th');
            th.classList.add('jtable_filter');
            th.innerHTML = this.column_names[i];            
            th.id = this.name +"__filter__"+this.column_names;
            this.filter_row.appendChild(th);
        }
    }

    fill_data(){
        // now we fill the data 
        for (let i =0; i < this.data.length; i ++)
        {
            let data_row = this.my_html.insertRow();
            for (let f =0; f < this.column_names.length; f++)
            {
                let td = data_row.insertCell();
                td.innerHTML = this.data[i][this.column_names[f]];
            }
        }
        this.my_top = my_table.my_html.getBoundingClientRect().top;
    }

    show(){
        this.my_html.display='block';
    }

    add_column_header_listeners(){
        for(let i =0; i <this.column_names; i ++){

        }
    }
};

