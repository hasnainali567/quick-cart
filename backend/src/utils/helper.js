import slugifyLib from 'slugify';
export const slugify = (text) => {
    return slugifyLib(text, {
        lower: true,
        strict: true,
        trim: true,
        replacement: '-'
    });
}

export const paginateResponse = (data, total, page, limit) => {
  return {
    data,
    meta: {
      total,
      page:       parseInt(page),
      limit:      parseInt(limit),
      totalPages: Math.ceil(total / limit),
      hasNext:    parseInt(page) < Math.ceil(total / limit),
      hasPrev:    parseInt(page) > 1
    }
  }
}