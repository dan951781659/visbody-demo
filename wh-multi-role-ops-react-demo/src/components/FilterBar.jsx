export default function FilterBar({
  search,
  onSearchChange,
  dateOptions,
  activeDate,
  onDateChange,
  filters,
  tier,
  onTierChange,
  onRefresh
}) {
  return (
    <div className="topbar">
      <div className="topbar-toolbar">
        <div className="segmented">
          <button className={tier === "basic" ? "active" : ""} onClick={() => onTierChange("basic")}>
            非 Pro
          </button>
          <button className={tier === "pro" ? "active" : ""} onClick={() => onTierChange("pro")}>
            Pro
          </button>
        </div>
        <button className="ghost-btn" onClick={onRefresh}>
          刷新
        </button>
        <button className="primary-btn">导出当前视图</button>
      </div>

      <div className="filter-bar">
        <input
          className="search-box"
          value={search}
          placeholder="搜索门店、用户、风险标签"
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <div className="segmented">
          {dateOptions.map((option) => (
            <button
              key={option.key}
              className={activeDate === option.key ? "active" : ""}
              onClick={() => onDateChange(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {filters.map((filter) => (
          <select
            key={filter.key}
            className="select-box"
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
