// 展开属性 用于 jsx 中
export const unfoldProps = (type, ...args) => {
    return { [type]: Object.assign({}, ...args) };
};
