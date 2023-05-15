const parseDate = (date) => {
    const Tsplit = date.split('T');
    const [y, m, d] = Tsplit[0].split('-');
    return d+'-'+m+'-'+y + ' ' + Tsplit[1].split('.')[0];
}

export { parseDate };