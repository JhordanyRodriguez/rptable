

let RPTableAgg = class {

    

    constructor(rptable){
        console.log('creating aggregator');
        this.rptable = rptable;
        this.agg_div = document.createElement('DIV');
        this.agg_div.id = 'rptable_agg';
        this.agg_div.classList.add('rptable_agg');
        let aggTable = document.createElement('TABLE');
        let aggRow = document.createElement('TR');
        aggRow.classList.add('rptable_row');
        aggTable.classList.add('rptable_table');
        let atbody = document.createElement('tbody');
        atbody.appendChild(aggRow);
        for (let i =0; i < this.rptable.columns_info.length; i ++)
        {
            let agg_td = aggRow.insertCell();
            agg_td.classList.add('rptable_agg_td');
            agg_td.style.minHeight = '10px';
            agg_td.id = "input_in__rptable_agg__"+ this.rptable.columns_info[i].name;

        }
        aggTable.appendChild(atbody);
        this.agg_div.appendChild(aggTable);
        this.rptable.parent.appendChild(this.agg_div);
        this.agg_div.style.position = "fixed";
        let top_for_agg = this.rptable.pagination_div.getBoundingClientRect().bottom +'px';
        console.log('will use top of '+ top_for_agg);
        this.agg_div.style.top = top_for_agg;
        window.addEventListener('resize', ()=> this.re_adjust_aggregation());
        my_table.onContentChangedCallBacks.push((x)=> this.aggregate());
        this.aggregate();
        // the time should be higher than the one for the pagination.
        setTimeout((x)=>this.re_adjust_aggregation(),110);
    }

    aggregate()
    {
        let pass_filters = this.rptable.html_mirror.filter((x)=> x.passes_filters()).map((x)=> x.abs_index);
        for (let i =0; i < this.rptable.columns_info.length; i ++)
        {
            
            if (this.rptable.columns_info[i].type =="number")
            {
                let this_property = this.rptable.columns_info[i].name;
                let working_with = pass_filters.map((x)=> this.rptable.data[x][this_property]);
                let my_id = "input_in__rptable_agg__"+ this_property;
                let agg_td = document.getElementById(my_id);
                let sum = working_with.reduce((x,y)=> x+y,0);
                agg_td.textContent = sum/working_with.length;
                //let working_with = Array.apply(null, pass_filters).map(function(value, index){ })
                //let working_with = Array.apply(this, pass_filters).map((x,y,z)=> { x,y});
                console.log('working with');
                console.log(working_with);
            
            }

        }
    }

    re_adjust_aggregation()
    {
        let top_for_agg = this.rptable.pagination_div.getBoundingClientRect().bottom +'px';
        console.log('will readjust '+ top_for_agg);
        this.agg_div.style.top = top_for_agg;
    }
 }
    


