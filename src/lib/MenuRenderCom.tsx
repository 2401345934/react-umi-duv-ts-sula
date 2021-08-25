import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from '@/globalapp.less';

const MenuRenderCom: React.FC<{}> = (props: any) => {
  const [firstMenu, SetFirstMenu] = useState('');
  const [firstMenuData, SetFirstMenuData] = useState([]);
  const [secondMenu, SetSecondMenu] = useState('');

  useEffect(() => {
    SetFirstMenu(`/${props.location.pathname.split('/')[1]}`);
    const firstMenuDataTemp = props?.menuData?.filter(
      (item: any) => item.key === `/${props.location.pathname.split('/')[1]}`,
    );
    SetFirstMenuData(firstMenuDataTemp.length ? firstMenuDataTemp[0].children : []);
    SetSecondMenu(props.location.pathname);
  }, [props.location.pathname]);

  return (
    <aside className={styles.sider}>
      <div className={styles.sider_first}>
        {props?.menuData &&
          props?.menuData
            .filter((item: any) => item.name)
            ?.map((value: any) => (
              <div
                className={classNames(
                  styles.sider_first_item,
                  firstMenu === value.key ? styles.sider_first_item_active : '',
                )}
                onClick={() => {
                  SetFirstMenu(value.key);
                  SetFirstMenuData(value.children);
                }}
              >
                <span className={styles.sider_first_item_icon}>
                  {value.icon && value.icon.type.render()}
                </span>
                {value.name}
              </div>
            ))}
      </div>
      <div className={styles.sider_second}>
        {firstMenuData
          ?.filter((item: any) => !item.hideInMenu)
          ?.map((item) => {
            const SecondMenu = ({ item }: { item: any }) => {
              const [expandMenu, SetExpandMenu] = useState(1);
              return (
                <div>
                  {item.children?.filter((item: any) => !item.hideInMenu).length ? (
                    <div className={classNames(styles.sider_second_item_1)}>
                      <span className={styles.sider_second_item_1_dolt}></span>
                      {item.name}
                      <span className={styles.sider_second_item_1_action}>
                        {expandMenu ? (
                          <DownOutlined
                            onClick={() => {
                              SetExpandMenu(0);
                            }}
                          />
                        ) : (
                          <UpOutlined
                            onClick={() => {
                              SetExpandMenu(1);
                            }}
                          />
                        )}
                      </span>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => {
                        SetSecondMenu(item.key);
                      }}
                    >
                      <div
                        className={classNames(
                          styles.sider_second_item_2,
                          styles.sider_second_item_2_active,
                          secondMenu === item.key ? styles.sider_second_item_2_click : '',
                        )}
                      >
                        {item.name}
                      </div>
                    </Link>
                  )}

                  <div>
                    {item.children
                      ?.filter((item: any) => !item.hideInMenu)
                      .map((innerItem: any) => {
                        return (
                          <Link
                            to={innerItem.path}
                            onClick={() => {
                              SetSecondMenu(innerItem.key);
                            }}
                          >
                            <div
                              className={classNames(
                                styles.sider_second_item_2,
                                expandMenu ? styles.sider_second_item_2_active : '',
                                secondMenu === innerItem.key
                                  ? styles.sider_second_item_2_click
                                  : '',
                              )}
                            >
                              {innerItem.name}
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            };

            return (
              <div className={styles.sider_second_item}>
                <SecondMenu item={item} />
              </div>
            );
          })}
      </div>
    </aside>
  );
};

export default MenuRenderCom;
