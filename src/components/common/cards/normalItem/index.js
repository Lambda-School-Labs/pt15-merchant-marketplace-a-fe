import { useOktaAuth } from '@okta/okta-react';
import React, { useEffect, useState } from 'react';
import { getDSData } from '../../../../api';
import './itemCardStyles.css';
import { Tag } from 'antd';
import { MinusCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getProductCategory, getProductTag } from '../../../../state/actions';
function ItemCard({ name, description, price, image, count, published }) {
  const [img, setImg] = useState('');
  const { authState } = useOktaAuth();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  let dollars = price / 100;

  //<----------------Get Element---------------->
  const getElement = (id, url, setState, errMessage) => {
    getDSData(`${process.env.REACT_APP_API_URI}${url}${id}`, authState)
      .then(res => setState(res))
      .catch(err => {
        console.log(errMessage);
      });
  };
  //<----------------Get Image---------------->
  const imgGet = id => {
    getDSData(`${process.env.REACT_APP_API_URI}photo/${id}`, authState)
      .then(res => setImg(res[0]['url']))
      .catch(err => {
        console.log('Img get fail in ItemCard');
      });
  };
  useEffect(() => {
    imgGet(image);
    getElement(
      image,
      'category/',
      setCategories,
      'Category get fail in ItemCard'
    );
    getElement(image, 'tag/item/', setTags, 'Tag get fail in ItemCard');
  }, []);

  useEffect(() => {
    dispatch(getProductCategory(authState, image));
    dispatch(getProductTag(authState, image));
  }, []);

  return (
    <div className="cardContainer">
      <img src={img} className="cardImage" />
      <div className="cardDesc">
        <h2 className="descText">{name}</h2>
        <p className="descText" activeStyle={{ color: 'black' }}>
          {description}
        </p>
        <div className="categories-tags">
          <div className="category-tag ">
            <h3>Categories: </h3>
            {categories.map(category => (
              <p className="category" key={category.id}>
                {category.category_name}
              </p>
            ))}
          </div>
          <div className="category-tag">
            <h3>Tags: </h3>
            {tags.map(tag => (
              <Tag className="tags" style={{ width: 'auto' }} key={tag.id}>
                {tag.tag_name}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="cardPrice">${dollars}</h2>
        {count !== 0 ? (
          <h2 style={{ color: 'green' }}>QTY: {count}</h2>
        ) : (
          <h2 style={{ color: 'red' }}>QTY: {count}</h2>
        )}
        {published ? (
          <CheckCircleOutlined style={{ fontSize: '20px', color: 'green' }} />
        ) : (
          <MinusCircleOutlined style={{ fontSize: '20px', color: 'red' }} />
        )}
      </div>
    </div>
  );
}

export default ItemCard;
