import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import { SidebarData } from "../../data/json/sidebarData";
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu } from "../../data/redux/commonSlice";

const Sidebar = () => {
  const Location = useLocation();
  const { expandMenu } = useSelector((state) => state.crms);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  let control = user?.role?.control;
  const [searchParams, setSearchParams] = useSearchParams();

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");

  const toggleSidebar = (title) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };
  const toggle = () => {
    dispatch(setExpandMenu(true));
  };
  const toggle2 = () => {
    dispatch(setExpandMenu(false));
  };

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll(".submenu");
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);

  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={toggle}
        onMouseLeave={toggle2}
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className="clinicdropdown theme">
                  <Link to="/profile">
                    {/* <ImageWithBasePath
                      src="assets/img/profiles/avatar-14.jpg"
                      className="img-fluid"
                      alt="Profile"
                    /> */}
                    <div
                      className="d-flex justify-content-center align-items-center bg-primary text-white fw-bold rounded-circle"
                      style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "18px",
                      }}
                    >
                      {user?.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase())
                        .join("")}
                    </div>
                    <div className="user-names">
                      <h5 className="text-capitalize">{user?.name}</h5>
                      <div className="mt-2">
                        {user?.ofCompany?.name && (
                          <h6 className="text-capitalize">
                            {user?.ofCompany?.name?.split("-").join(" ")}
                          </h6>
                        )}
                        <h6 className="text-capitalize">
                          {user?.role?.name?.split("-").join(" ")}
                        </h6>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>

              <ul>
                {SidebarData?.map((mainLabel, index) => (
                  <li className="clinicdropdown" key={`main-${index}`}>
                    <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title, i) => {
                        let link_array = [];
                        if ("submenuItems" in title) {
                          title.submenuItems?.forEach((link) => {
                            link_array.push(link?.link);
                            if (link?.submenu && "submenuItems" in link) {
                              link.submenuItems?.forEach((item) => {
                                link_array.push(item?.link);
                              });
                            }
                          });
                        }
                        title.links = link_array;

                        return (
                          <span key={`main-${index}-${i}`}>
                            {control[title?.label?.toLocaleLowerCase()]
                              ?.length > 0 ? (
                              <li
                                className="submenu"
                                key={`submenu-${title?.label || i}`}
                              >
                                <Link
                                  to={
                                    title?.submenu
                                      ? searchParams.get("companyid")
                                        ? `?companyid=${searchParams.get(
                                            "companyid"
                                          )}`
                                        : "#"
                                      : title?.link
                                  }
                                  onClick={() => toggleSidebar(title?.label)}
                                  className={`${
                                    subOpen === title?.label ? "subdrop" : ""
                                  } ${
                                    title?.links?.includes(Location.pathname)
                                      ? "active"
                                      : ""
                                  } ${
                                    title?.submenuItems
                                      ?.map((link) => link?.link)
                                      .includes(Location.pathname) ||
                                    title?.link === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink1 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink2 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink3 === Location.pathname
                                      ? "active"
                                      : "" ||
                                        title?.subLink4 === Location.pathname
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <i className={title.icon}></i>
                                  <span>{title?.label}</span>
                                  <span
                                    className={
                                      title?.submenu ? "menu-arrow" : ""
                                    }
                                  />
                                </Link>
                                <ul
                                  style={{
                                    display:
                                      subOpen === title?.label
                                        ? "block"
                                        : "d-none",
                                  }}
                                >
                                  {title?.submenuItems?.map((item, j) => (
                                    <li
                                      className="submenu submenu-two"
                                      key={`submenu-item-${item?.label || j}`}
                                    >
                                      <Link
                                        to={item?.link}
                                        className={`${
                                          item?.submenuItems
                                            ?.map((link) => link?.link)
                                            .includes(Location.pathname) ||
                                          item?.link === Location.pathname
                                            ? "active subdrop"
                                            : ""
                                        } `}
                                        onClick={() => {
                                          toggleSubsidebar(item?.label);
                                        }}
                                      >
                                        {item?.label}
                                        <span
                                          className={
                                            item?.submenu ? "menu-arrow" : ""
                                          }
                                        />
                                      </Link>
                                      <ul
                                        style={{
                                          display:
                                            subsidebar === item?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item?.submenuItems?.map((items, k) => (
                                          <li
                                            key={`submenu-item-deep-${
                                              items?.label || k
                                            }`}
                                          >
                                            <Link
                                              to={items?.link}
                                              className={`${
                                                subsidebar === items?.label
                                                  ? "submenu-two subdrop"
                                                  : "submenu-two"
                                              } ${
                                                items?.submenuItems
                                                  ?.map((link) => link.link)
                                                  .includes(
                                                    Location.pathname
                                                  ) ||
                                                items?.link ===
                                                  Location.pathname
                                                  ? "active"
                                                  : ""
                                              }`}
                                            >
                                              {items?.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ) : (
                              <></>
                            )}
                          </span>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default Sidebar;
