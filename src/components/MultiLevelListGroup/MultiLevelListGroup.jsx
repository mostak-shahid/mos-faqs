import React, { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MultiLevelListGroup = ({ data, level = 0 }) => {
  const [openKeys, setOpenKeys] = useState({});
  const navigate = useNavigate();

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

  return (
    <ListGroup variant="flush" className={level > 0 ? 'ms-3' : ''}>
      {Object.entries(data).map(([key, item]) => {
        const hasSub = !!item.sub;
        const isOpen = openKeys[key];

        return (
          <React.Fragment key={key}>
            <ListGroup.Item
              action
              as="div"
              onClick={(e) => handleItemClick(key, item, e)}
              className="d-flex justify-content-between align-items-center"
              style={{
                cursor: 'pointer',
                // paddingLeft: `${1 + level * 1.25}rem`,
              }}
            >
              <span>{item.title}</span>
              {hasSub && (
                <span style={{ fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
              )}
            </ListGroup.Item>

            {/* Recursive rendering for nested submenus */}
            {hasSub && isOpen && (
              <MultiLevelListGroup data={item.sub} level={level + 1} />
            )}
          </React.Fragment>
        );
      })}
    </ListGroup>
  );
};

export default MultiLevelListGroup;
