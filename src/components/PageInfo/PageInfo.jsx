import { useLocation } from 'react-router-dom';
import { useMain } from '../../contexts/MainContext';
const findPageInfo = (menu, path) => {
    for (const key in menu) {
        const item = menu[key];
        if (item.url === path) {
            return { title: item.title, description: item.description };
        }
        if (item.sub) {
            const foundInSub = findPageInfo(item.sub, path);
            if (foundInSub) return foundInSub;
        }
    }
    return null;
};

const PageInfo = ({ url }) => {
    const {
        settingsMenu
    } = useMain();
    const location = useLocation();
    const currentPath = url || location.hash.replace('#', '');
    const pageInfo = findPageInfo(settingsMenu, currentPath);
    // console.log("PageInfo:", pageInfo, "Current Path:", currentPath);
    if (!pageInfo) return null;

    return (
        <div className="page-info p-4 border-bottom">
            <h3 className="page-title">{pageInfo.title}</h3>
            {pageInfo.description && (
                <p className="page-description">{pageInfo.description}</p>
            )}
        </div>
    );
};

export default PageInfo;