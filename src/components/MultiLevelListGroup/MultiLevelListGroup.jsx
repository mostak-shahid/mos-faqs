import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { urlToArr } from '../../lib/Helpers';
import "./MultiLevelListGroup.scss";
const MultiLevelListGroup = ({ data, level = 0 }) => {
  const [openKeys, setOpenKeys] = useState({});
  // const [isOpen, setIsOpen] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const urlArr = urlToArr();
  const toggleSubMenu = (key) => {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));    
  };
  const handleItemClick = (key, item, e) => {
    if (item.sub) {
      e.preventDefault();
      toggleSubMenu(key);
    } else if (item.url) {
      navigate(item.url);
    }
  };
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
      .replace(/\-\-+/g, '-');     // Replace multiple - with single -
  };
  useEffect(()=> {
    if (urlArr.length === 0) return;
    const openKeysObj = urlArr.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setOpenKeys(openKeysObj);
    // console.log(urlArr, 'URL');
  },[urlArr])
  // setIsOpen(openKeys[key] ? key : '');
  return (
    <ul className={level > 0 ? 'child-list-group' : 'top-level-list-group'}>
      {/* {console.log(openKeys, "Open Keys")} */}

      {Object.entries(data).map(([key, item]) => {
        const hasSub = !!item.sub;
        const isOpen = openKeys[key];
        
        const isChildActive = currentPath.startsWith(item.url);
        return (
          <li 
            key={key}
            className={[
              `list-group-item`,
              `menu-item-${slugify(item.title)}`,
              hasSub ? 'has-submenu' : '',
              isChildActive ? 'active' : '',
              isOpen ? 'menu-open' : '',
              currentPath === item.url ? 'active' : '',
            ].filter(Boolean).join(' ')}
          >
            <a
              onClick={(e) => handleItemClick(key, item, e)}
              className={`d-flex justify-content-between align-items-center`}
              style={{
                cursor: 'pointer',
                // paddingLeft: `${1 + level * 1.25}rem`,
              }}
            >
              <span>{item.title}</span>
              {hasSub && (
                <span className={`dashicons ${isOpen ? 'dashicons-arrow-up-alt2' : 'dashicons-arrow-down-alt2'}`}/>
              )}
            </a>
            {/* Recursive rendering for nested submenus */}
            {hasSub && ( //{hasSub && isOpen && (
              <MultiLevelListGroup data={item.sub} level={level + 1} />
            )}
          </li>
        );
      })}

    </ul>
  );
};
export default MultiLevelListGroup;
