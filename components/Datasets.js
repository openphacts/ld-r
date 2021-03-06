import React from 'react';
import {defaultGraphName, authGraphName, enableAuthentication} from '../configs/general';
import {config} from '../configs/reactor';
import {facets} from '../configs/facets';
import URIUtil from './utils/URIUtil';
class Datasets extends React.Component {
    componentDidMount() {

    }
    prepareFocusList(list) {
        let out = [];
        list.forEach(function(f, i){
            out.push(<a key={i} href={f} target="_blank">{URIUtil.getURILabel(f)} </a>);
        });
        return out;
    }
    render() {
        let self = this;
        let user = this.context.getUser();
        let sources = ['dataset', 'dataset_resource', 'dataset_property', 'dataset_object', 'dataset_resource_property', 'dataset_resource_object', 'dataset_property_object', 'dataset_resource_property_object'];
        let dss = [], dfl, brws, color, output = [], focus = '';
        let info = <div className="ui blue message">
                        The list contains only the datasets for which at least one <b>config scope</b> is found!
                   </div>;
        if(enableAuthentication && !user){
            output.push(<div className="ui warning message"><div className="header"> Please <a href="/register">Register</a> or <a href="/login">Login</a> to see the datasets.</div></div>);
        }else{
            sources.forEach(function(s){
                for(let graph in config[s]){
                    //check if it readOnly
                    color = 'black';
                    focus = '';
                    if(s === 'dataset'){
                        if(config[s][graph].readOnly === 0){
                            color = 'green';
                        }
                        if(config[s][graph].resourceFocusType && config[s][graph].resourceFocusType.length){
                            focus = <span className="ui small circular label"> {self.prepareFocusList(config[s][graph].resourceFocusType)} </span>;
                        }
                    }
                    if(graph !== authGraphName[0] && graph !== 'generic'){
                        dfl = '';
                        brws = '';
                        if(graph === defaultGraphName[0]){
                            dfl = <i className="ui teal flag icon" title="default dataset"></i>;
                        }
                        if(dss.indexOf(graph) === -1){
                            if(facets[graph]){
                                brws = <a className="ui grey label" href={'/browse/' + encodeURIComponent(graph)} title="browse"><i className="zoom icon"></i>browse</a>;
                            }
                            dss.push(graph);
                            output.push(<div className="ui item" key={graph}> <div className="content"> <i className={'ui icon cubes ' + color} ></i> <a className="ui blank link" href={'/dataset/1/' + encodeURIComponent(graph)} title="go to resource list">{graph}</a> {focus} {brws} {dfl}</div> </div>);
                        }
                    }
                }
            });
            //if only facet is set
            for(let graph in facets){
                if(graph !== authGraphName[0] && graph !== 'generic'){
                    if(dss.indexOf(graph) === -1){
                        brws = '';
                        dfl = '';
                        if(graph === defaultGraphName[0]){
                            dfl = <i className="ui green flag icon" title="default dataset"></i>;
                        }
                        if(dss.indexOf(graph) === -1){
                            brws = <a className="ui label" href={'/browse/' + encodeURIComponent(graph)} title="browse"><i className="zoom icon"></i>browse</a>;
                            dss.push(graph);
                            output.push(<div className="ui item" key={graph}> <div className="content"> <i className="ui blue icon cubes"></i> <a href={'/dataset/1/' + encodeURIComponent(graph)} title="go to resource list">{graph}</a> {brws} {dfl}</div> </div>);
                        }
                    }
                }
            }
            if(!dss.length){
                if(defaultGraphName[0]){
                    output.push(<div className="ui item" key={defaultGraphName[0]}> <div className="content"> <i className="ui blue icon cubes"></i> <a href={'/dataset/1/' + encodeURIComponent(defaultGraphName[0])} title="go to resource list">{defaultGraphName[0]}</a> </div> </div>);
                }else{
                    //no graph name is specified
                    output.push(<div className="ui big item" key="empty" > <div className="content">  Your config is empty!<a href={'/dataset/'}> <span className="ui big blue label">See all resources in all local datasets</span></a></div> </div>);
                }
            }
        }
        return (
            <div className="ui page grid" ref="datasets">
                <div className="ui column">
                    {dss.length ? <div>{info}</div> : ''}
                    <div className="ui segment">
                        <h1>Datasets</h1>
                        <div className="ui big divided list">
                            {output}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Datasets.contextTypes = {
    getUser: React.PropTypes.func
};
export default Datasets;
