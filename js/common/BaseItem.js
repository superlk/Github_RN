import React, {Component} from 'react';
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview';
import {PropTypes} from 'prop-types';

export default class BaseItem extends Component {
    static proTypes = {
        projectModel: PropTypes.object,
        onSelect: PropTypes.func,
        onFavorite: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
        }
    }

    /**
     *  componentWillReceiveProps在新版react中不在使用，用一下方法替代
     * @param nextProps
     * @param prevState
     */
    static getDerivedStateFrpmProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if (prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite
            }
        }
        return null;
    }


    componentWillReceiveProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if (prevState.isFavorite !== isFavorite) {
            this.setState(
                {
                    isFavorite: isFavorite
                }
            )
        }
    }

    setFavoriteSate(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite
        })
    }

    onPressFavorite() {
        this.setFavoriteSate(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }

    onItemClick() {
        this.props.onSelect(isFavorite => {
            this.setFavoriteSate(isFavorite);
        });
    }

    _favoriteIcon() {
        return <TouchableOpacity
            style={{padding: 6}}
            underlayColor='transparent'
            onPress={() => this.onPressFavorite()}
        >
            <FontAwesome
                name={this.state.isFavorite ? 'star' : 'star-o'}
                size={26}
                style={{color: '#678'}}
            />
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({});
