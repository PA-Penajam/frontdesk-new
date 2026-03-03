type SearchParamsLike = URLSearchParams | { toString(): string }

export function cloneSearchParams(searchParams: SearchParamsLike): URLSearchParams {
  return new URLSearchParams(searchParams.toString())
}

export function setOrDeleteParam(
  params: URLSearchParams,
  key: string,
  value: string
): void {
  if (value) {
    params.set(key, value)
    return
  }

  params.delete(key)
}

export function buildPathWithParams(pathname: string, params: URLSearchParams): string {
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}
