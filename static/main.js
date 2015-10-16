// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var moment = require('moment');


var Location = React.createClass({
	onDrag: function(e){
		e.key = this.props.i
		e.min = this.props.o - (this.props.o * this.props.v)
		e.max = this.props.o + (this.props.o * this.props.v)
		this.props.onDrag(e)
	},
	rm: function(e){
		this.props.rm(this.props.i)
	},
	render: function(){
		var self = this;
		var locStyle = {
			top: this.props.y + 'px'
		}
		var rm = function(){
			if(!self.props.p){
				return(<span className="kill" onClick={self.rm}> x</span>)
			}
		}
		var formatstr = "MM/DD/YYYY hh:mm a"
		return(
			<div>
				<div onDragEnd={this.speak} onDrag={this.onDrag} style={locStyle} className="loc"></div>
				<div className="info" style={locStyle}>
					{this.props.y}km  <br />
					start: {moment(this.props.time).add(this.props.min, 'm').format(formatstr)} <br/>
					close: {moment(this.props.time).add(this.props.max, 'm').format(formatstr)} 
					{rm()}
				</div>
			</div>
		);
	}
});

var TimePicker = React.createClass({
	onDateChange: function(e){
		var delta = e.target.value.split("-");
		var t = this.props.datetime
		t.month(parseInt(delta[1])-1);
		t.date(parseInt(delta[2]));
		t.year(delta[0]);
		this.props.ch(t);
	},
	onTimeChange: function(e){
		var delta = e.target.value.split(":");
		var t = this.props.datetime
		t.hour(delta[0]);
		t.minute(delta[1]);
		this.props.ch(t);
	},
	render:function(){
		var date = moment(this.props.datetime).format("YYYY-MM-DD");
		var time = moment(this.props.datetime).format("HH:mm");
		return(
			<div>
				<input onChange={this.onDateChange} defaultValue={date} type='date'/>
				<input onChange={this.onTimeChange} defaultValue={time} type='time'/>
			</div>
		)
	}
})

var Brevit = React.createClass({
	mixins: [LinkedStateMixin],
	getInitialState: function(){
		return {
			distance:[200,300,400,600,1000,1200],
			starttime: moment(),
			d:0,
			controls:[]
		}
	},

	componentDidMount: function(){
		this.createLocation(200,.1,true);
		this.createLocation(0,0,true);
	},

	setBrevit:function(brevit,i){
		var st = this.state;
		st.controls[i].min = brevit.min
		st.controls[i].max = brevit.max
		this.setState(st);
	},

	// moment(this.state.starttime).add(brevit.max, 'm').format()
	requestBrevit:function(d,i,f){
		this.state.controls[i].y = d;
		$.get( "http://127.0.0.1:5000/_calc_times", { miles: d } )
		  .done(function( brevit ) {
		  	f(brevit,i);	
		  });
	},
	drag: function(e){		
		if(
			e.clientY < this.state.distance[this.state.d]*1.1 
			&& e.clientY !=0
			&& e.clientY > e.min
			&& e.clientY < e.max
			){
			this.requestBrevit(e.clientY, e.key, this.setBrevit);
		}		
	},
	onClick: function(e){
		var d= e.clientY-20;
		this.createLocation(d,1,false)
	},
	createLocation: function(d,v,p){
		var v = v||1.0
		var st = this.state;
		st.controls.push({y:Math.max(0,d), o:d, v:v, p:p})
		this.requestBrevit(d, st.controls.length-1, this.setBrevit)
		this.setState(st);	
	},
	removeLocation:function(i){
		var st = this.state;
		st.controls.splice(i,1);
		this.setState(st);
	},
	changeMaxBrevit: function(i){
		var st = this.state;
		var optionNums = st.distance.length-1
		var delta = i>0 ? Math.min(optionNums,st.d+i) : Math.max(0,st.d+i); 
		st.d = delta;
		this.setState(st);
		this.requestBrevit(st.distance[delta], 0, this.setBrevit)
	},
	updateTime:function(m){
		var st = this.state;
		st.starttime = m;
		this.setState(st);
	},
	render: function(){
		let self = this;
		let ctrl = this.state.controls.map(function(v,i){
			return(
				<Location time={self.state.starttime} rm={self.removeLocation} onDrag={self.drag} min={v.min} max={v.max} key={i} i={i} y={v.y} p={v.p} o={v.o} v={v.v} />
			)
		})
		let minus = ()=>{self.changeMaxBrevit(-1)}
		let add = ()=>{self.changeMaxBrevit(1)}

		var height = this.state.distance[this.state.d]

		let style = {
			height: (height*1.1)+20+'px'
		}

		return(
			<div>
				<div className="brevit" style={style}>
				<div id="bk" onClick={self.onClick}></div>
					{ctrl}
					<span onClick={minus} id="minus">-</span>
					<span onClick={add} id="add">+</span>
				</div>

				<br /><br /><br /><br />
				start time:
				<TimePicker ch={self.updateTime} datetime={this.state.starttime}/>
			</div>
		);
	}
});

ReactDOM.render(
  <Brevit />,
  document.getElementById('brevit')
);

