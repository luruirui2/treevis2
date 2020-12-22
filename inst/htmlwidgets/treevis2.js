HTMLWidgets.widget({

  name: 'treevis2',

  type: 'output',

  factory: function(el, width, height) {

    // d3js 实现 树图
    
    console.log(width);
    console.log(height);    
    // 定义树图的全局属性
    var margin = {top: 20, right: 120, bottom: 10, left: 60};
        width = width - margin.right - margin.left,
        height = height - margin.top - margin.bottom;
        
    // 节点位置
    var dx = 12;
        dy = 0.8*(width / 6 );
    
    // 创建画布, 定义节点属性， 边属性
    var svg = d3.select(el).append("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx])
        .style("user-select", "none");
        //.style('background', '#F5F5F5');
        
    
    //调试使用
    console.log(d3);
    
    return {

      renderValue: function(x) {
        
        //接受收据
        data = x.data;
        
        
    
        // 定义树图布局
        var tree = d3.tree().nodeSize([dx, dy]);
	
	
    
        // 创建斜线生成器
        var diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
    
        // 过度延时时间
        var duration = d3.event && d3.event.altKey ? 2500 : 250;
        
        var gLink = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);
        
        var gNode = svg.append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");
        
        // 将数据构造成根节点
        var root = d3.hierarchy(data);
        root.x0 = dy / 2;
        root.y0 = 0;
        root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
            if ( d.depth > 2) d.children = null; // 用于设置默认展开前三层
        });
    
        // console.log(root);
        
        update(root);
    
        
        function update(source) {
    
            const nodes = root.descendants().reverse();
            const links = root.links();
    
            // 计算新的布局
            tree(root);
            
            let left = root;
            let right = root;
            
            root.eachBefore(node => {
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node;
            });
            
            const height = right.x - left.x + margin.top + margin.bottom;
            
            // 动画效果
            const transition = svg.transition()
                .duration(duration)
                .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
                .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));
            
            // Update the nodes…
            const node = gNode.selectAll("g")
                .data(nodes, d => d.id);
    
            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append("g")
                .attr("transform", d => `translate(${source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .on("click", (d) => {
                    d.children = d.children ? null : d._children;
                    update(d);
                });
    
            nodeEnter.append("circle")
                .attr("r", 2.5)
                .attr("fill", d => d._children ? "#555" : "#999")
                .attr("stroke-width", 10);
    
            nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d._children ? -6 : 6)
                .attr("text-anchor", d => d._children ? "end" : "start")
                .text(d => d.data.name)
                .style("font", "9px Microsoft YaHei")
                .clone(true).lower()
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .attr("stroke", "white");
    
            // 展开子节点到新位置
            const nodeUpdate = node.merge(nodeEnter)
                .transition(transition)
                .attr("transform", d => `translate(${d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);
            
    
            // 收起子节点到父节点位置
            const nodeExit = node.exit()
                .transition(transition)
                .remove()
                .attr("transform", d => `translate(${source.y},${source.x})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);
            
            // Update the links…
            const link = gLink.selectAll("path")
                .data(links, d => d.target.id);
            
            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().append("path")
                .attr("d", d => {
                    const o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });
    
            // Transition links to their new position.
            link.merge(linkEnter)
                .transition(transition)
                .attr("d", diagonal);
    
            // Transition exiting nodes to the parent's new position.
            link.exit()
                .transition(transition)
                .remove()
                .attr("d", d => {
                    const o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                });
    
            // Stash the old positions for transition.
            root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
            
            
        }
        

      },

      resize: function(width, height) {
        // svg随 width 和 height 变化 
        
        
        d3.select(el).append("svg")
          .attr("viewBox", [-margin.left, -margin.top, width, dx]);
        /*
        const transition = svg.transition()
          .duration(duration)
          .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));
        */

      }

    };
  }
});