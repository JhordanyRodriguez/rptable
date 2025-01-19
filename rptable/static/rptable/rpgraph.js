/*
Copyright (c) 2025 Jhordany Rodriguez Parra.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following condition:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/**
 * A class that helps counting the number of occurrencies for
 * every category in an array. That is, for ['yellow', 'red', 'blue', 'red']
 * we get yellow =1, red =2, blue =1 by iterating through the entries.
 * 
 */

var globalV = null;
class Multiset extends Map {
  constructor(...args) {
      super(...args);
  }

  add(elem) {
      if (!this.has(elem))
          this.set(elem, 1);
      else
          this.set(elem, this.get(elem)+1);
  }
}


/**
 * Creates a Graph object that interacts with a RPTable.
 * 
 * @param {RPTable} rptable 
 * @param {HTMLElement} parentDiv The div in which the canvas and controls will be located.
 */
let RPgraph = class {

  /**
   * 
   * @param {HTMLElement} selectToPopulate 
   */
  populateSelect(selectToPopulate){
    for (let i =0; i < this.rptable.columnsInfo.length; i ++){
      let opt = document.createElement('option');
      opt.textContent = this.rptable.columnsInfo[i].name;
      opt.value = this.rptable.columnsInfo[i].index;
      selectToPopulate.options.add(opt);
    }
  }

  /**
   * Event executed when the refresh button is clicked.
   */
  refreshNewSettings()
  {
    this.updateEvent();
  }
  /**
   * 
   * @param {RPTable} rptable 
   */
  constructor(rptable, parentDiv){
    //this.createNewChart();
    this.rptable = rptable;
    this.myChart = null;
    this.parentDiv = parentDiv;
    this.horizontalProperty ='carer';
    this.parentDiv.classList.add('row');
    this.operations =[{"value": 0, "textContent":"count"},
                      {"value": 1, "textContent":"sum"},
                      {"value": 2, "textContent":"mean"}]
    this.left_column = document.createElement('div');
    this.left_column.classList.add('rpgraphColumn');
    this.left_column.classList.add('left');
    this.left_column.classList.add('column');
    this.left_column.style.float= "left";
    this.parentDiv.appendChild(this.left_column);
    this.parentDiv.style.width = "100%";
    this.right_column = document.createElement('div');
    this.right_column.classList.add('rpgraphColumn');
    this.right_column.classList.add('right');
    this.right_column.classList.add('column');
    this.right_column.style.float= "right";
    let horizontalLabel = document.createElement('label');
    horizontalLabel.textContent = "Property for X axis: "
    this.horizontalSelect = document.createElement('select');
    this.populateSelect(this.horizontalSelect);
    this.verticalSelect = document.createElement('select');
    this.populateSelect(this.verticalSelect);
    let verticalLabel = document.createElement('label');
    verticalLabel.textContent = 'Property for Y axis';
    this.right_column.appendChild(horizontalLabel);
    this.right_column.appendChild(this.horizontalSelect);
    this.right_column.appendChild(document.createElement('br'));
    this.right_column.appendChild(verticalLabel);
    this.right_column.appendChild(this.verticalSelect);

    let operationLabel = document.createElement('label');
    operationLabel.textContent = 'Operation in Y';
    this.operationSelect = document.createElement('select');
    for (let i =0; i < this.operations.length; i ++){
      let op = document.createElement('option');
      op.textContent = this.operations[i]['textContent'];
      op.value = this.operations[i]['value'];
      this.operationSelect.options.add(op);
    }
    this.right_column.appendChild(document.createElement('br'));
    this.right_column.appendChild(operationLabel);
    this.right_column.appendChild(this.operationSelect);
    let setGraphButton = document.createElement('button');
    setGraphButton.textContent = 'refresh';
    setGraphButton.addEventListener('click', ()=> this.refreshNewSettings())
    this.right_column.appendChild(setGraphButton);
    
    this.parentDiv.appendChild(this.right_column);

    this.rptable.onContentChangedCallBacks.push(()=> this.updateEvent());
  }

  /**
   * Event linked to the content change trigger and called by the 'refresh'
   * button.
   */
  updateEvent()
  {
    let hv = this.horizontalSelect.value;
    this.horizontalProperty= this.rptable.columnsInfo[hv].name;
    let vp = this.verticalSelect.value;
    this.verticalProperty = this.rptable.columnsInfo[vp].name;
    this.aggOperation = this.operations[this.operationSelect.value].textContent;

    if (this.aggOperation == 'count'){
      let labelsData = this.get_basic_count(this.horizontalProperty);
      this.updateChart(labelsData);
    }
    else if (this.aggOperation == 'sum' || this.aggOperation== "mean")
    {
      if (this.rptable.columnsInfo[vp].type !="number"){
        alert('cannot aggregate a non-numerical feature. Change the Y axis property to a numerical feature');
        return;
      }
      let labelsData = this.get_aggregations(this.horizontalProperty, this.verticalProperty, this.aggOperation);
      this.updateChart(labelsData);
    }
  }

  /**
   * given the labels and data passed redraws the graph.
   * the current value of this.horizontalProperty will be used as label.
   * @param {JSON} labelsAndData 
   */
  updateChart(labelsAndData)
  {
    this.myChart.data.labels = labelsAndData["labels"];
    this.myChart.data.datasets[0].data = labelsAndData["data"];
    this.myChart.data.datasets[0].label = this.horizontalProperty;
    //console.log(labelsAndData["labels"]);
    //console.log(labelsAndData["data"]);
    this.myChart.update();
    
  }

  /**
   * Aggregates the data for each one of the categories defined by the 
   * feature (i.e, column) horizontalProp. For each bin, it executes
   * the operation 'operation' 
   * @param {string} horizontalProp 
   * @param {string} verticalProp 
   * @param {string} operation a value in ['sum', 'count', 'mean']
   * @returns 
   */
  get_aggregations(horizontalProp, verticalProp, operation){
    let passFilters = this.rptable.html_mirror.filter((x)=> x.passes_filters() == true);
    let absIndices = passFilters.map((x)=> x.absIndex);
    let myLabels = {}

    for (let i=0; i < absIndices.length; i ++)
    {
      let propertyValue = this.rptable.data[absIndices[i]][horizontalProp];
      let verticalValue = this.rptable.data[absIndices[i]][verticalProp]
      if (myLabels[propertyValue]!= undefined)
      {
          myLabels[propertyValue]['sum'] += verticalValue;
          myLabels[propertyValue]['count'] += 1;
      }
      else
      {
        myLabels[propertyValue]= {"sum": verticalValue, "count":1};
      }
    }
    console.log(myLabels);
    console.log(operation);
    let cats = Object.keys(myLabels);

    if (operation == "mean")
    {
      for (let i =0; i < cats.length; i ++)
      {
        myLabels[cats[i]]['data']= myLabels[cats[i]]['sum']/myLabels[cats[i]]['count'];
      }
    }
    else if (operation == "sum"){
      for (let i =0; i < cats.length; i ++){
        myLabels[cats[i]]['data']= myLabels[cats[i]]['sum'];
      }
    }

    let theLabels = Object.keys(myLabels);
    let toGraph = {"labels": theLabels,
                   "data": theLabels.map((x)=> myLabels[x]['data'])};
    console.log(toGraph);
    return toGraph;
  }


  /**
   * divides the dataset based on the values of column 'col'. For each category,
   * it counts the number of occurrencies.
   * @param {string} col 
   */
  get_basic_count(col){
    let passFilters = this.rptable.html_mirror.filter((x)=> x.passes_filters() == true);
    let absIndices = passFilters.map((x)=> x.absIndex);
    // we use the multiset data structure for fast computation.
    let counts = new Multiset();
    for (let i=0; i < absIndices.length; i ++)
    {
      counts.add(this.rptable.data[absIndices[i]][col]);
    }
    let labels = [];
    let values =[];
    let iterator = counts.entries();
    console.log('these are the iterators');
    console.log(counts);
    globalV = iterator;
    if (iterator != null){

      let current_map_ele = iterator.next();
      while (current_map_ele.done == false)
      {
        labels.push(current_map_ele.value[0]);
        values.push(current_map_ele.value[1]);
        current_map_ele = iterator.next();
      }
    }
    
    
    return {"labels": labels,
            "data": values
    };
    
  }

  /**
   * Creates a new bar chart where column 'col' is used to create categories.
   * For each category, we count the occurrencies and use these numbers for the
   * height of the bars.
   * @param {string} col 
   */
  createNewChart(col){
    
    //const ctx = document.getElementById('myChart');
    let basic_counts = this.get_basic_count(col);
    const ctx = document.createElement('canvas');
    ctx.id = 'myChart';
    this.left_column.appendChild(ctx);
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: basic_counts['labels'],
        datasets: [{
          label: col,
          data: basic_counts['data'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    let bottom = this.rptable.get_last_row_bottom();
    if (bottom != null)
    {
      this.left_column.style.position = 'fixed';
      this.left_column.style.top = (bottom + 50) +'px';
      //this.left_column.style.height = "50%";
      this.parentDiv.style.position = 'fixed';
      this.parentDiv.style.top = (bottom + 50) +'px';
      this.parentDiv.style.height = "50%";
    }
}

}
