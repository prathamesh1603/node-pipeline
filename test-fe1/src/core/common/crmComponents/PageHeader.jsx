import CollapseHeader from "../collapse-header";

const PageHeader = ({ pageName, totalCount, children }) => {
  return (
    <div className="page-header">
      <div className="row align-items-center">
        <div className="col-8 d-flex gap-2  align-items-center ">
          <div> {children}</div>
          <h4 className="page-title">
            {pageName}
            {totalCount ? (
              <span className="count-title">{totalCount}</span>
            ) : (
              ""
            )}
          </h4>
        </div>
        <div className="col-4 text-end">
          <div className="head-icons">
            <CollapseHeader />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
