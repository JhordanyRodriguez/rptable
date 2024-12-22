let get_abs_index = (x)=> x.abs_index;

function compare_strings(x,y){
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
let comparing_strings_from_indices = (data,col,i,j)=> compare_strings(data[i][col],
                                                                      data[j][col]);
/**
 * 
 * @param {JrpTable} rptable 
 * @param {*} column_name 
 * @param {*} column_index 
 * @returns 
 */
function sort_rptable(rptable, column_name, column_index){
    let pass_filters = rptable.html_mirror.filter((x)=> x.passes_filters());
    // it has to be the absolute, because we are looking into the data.
    let current_passing_indices = pass_filters.map(get_abs_index);
    current_passing_indices.sort((i,j)=> comparing_strings_from_indices(rptable.data, column_name, i,j));
    // update the sorting indices
    for (let i =0; i < current_passing_indices.length; i ++){
        rptable.html_mirror[current_passing_indices[i]].sorting_index =i;
    }
    
    // make the html rows visible if necessary
    let to_surface_n = Math.min(rptable.rows_per_page, current_passing_indices.length);
    let to_surface = current_passing_indices.slice(0, to_surface_n);
    let need_to_go = rptable.html_mirror.filter((x)=> x.display == true && to_surface.includes(x.sorting_index)== false);
    for (let i =0; i < need_to_go.length; i ++)
    {
        need_to_go[i].make_invisible();
    }
    rptable.make_indices_visible(to_surface);
    
    for (let i =0; i < to_surface; i ++){
        if (rptable.html_mirror[current_passing_indices[0]].row == null){

        }
    }
    return current_passing_indices;


}
/**
 * 
 * @param {RpTable} rptable 
 * @param {string} column_name 
 * @param {string} column_index 
 */
function sort_rptable_old(rptable, column_name, column_index)
{
    let column_info = rptable.columns_info[column_index];
    // the indices of the original data to consider
    let toConsider =Array.apply(null, Array(rptable.data.length)).map(function(x,i){return i;});
    //let toConsider = Array.apply((x)=>x, Array())
    toConsider = toConsider.filter((i) => rptable.html_mirror[i].passes_filters());
    console.log('to consider');
    console.log(toConsider);

    let before_ordering = Array.apply(null,
                                     toConsider.filter(x => x!= undefined))

    let comparing_strings= (x,y)=> rptable.compare_strings(rptable.data[x][column_name],
                                                           rptable.data[y][column_name]);
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
    let limit = Math.min(toConsider.length, rptable.rows_per_page);
    for (let i =0; i < limit; i ++){
        if (toConsider[i] != toConsider[i-n_swaps] | 4>3)
        {
            console.log('will swap  '+ toConsider[i] + ' with '+ before_ordering[i]);
            if (rptable.html_mirror[toConsider[i]].row == null){
                rptable.html_mirror[toConsider[i]].row = rptable.create_data_row(toConsider[i])
            }
            parent_node.insertBefore(rptable.html_mirror[toConsider[i]].row,
                                    rptable.html_mirror[before_ordering[i-n_swaps]].row)
            n_swaps++;

        }
    }
         
}


function create_sorters(rp_table)
{
    let sortable_columns = rp_table.column_names.filter((x)=> x != undefined);
    for (let i =0; i < sortable_columns.length; i ++)
    {
        let icolumn_name = rp_table.column_names[i].replace(' ','_');
        let _sorter_id = rp_table.name +"__mheader__"+icolumn_name;
        // this sorted id will need to refer to the newly created header_div
        let _header = document.getElementById(_sorter_id);
        if (_header != undefined){
            console.log('adding click listener to '+ _sorter_id);
            //_header.addEventListener('click', this.obtain_sorter(icolumn_name));
            _header.addEventListener('click',
                                     (e)=> sort_rptable(rp_table, icolumn_name, i));
        }
        else
        {
            console.log('could not find header with id '+ _sorter_id);
        }
    }
}



add_column_header_listeners()
{
    for(let i =0; i <rp_table.column_names; i ++){

    }
}