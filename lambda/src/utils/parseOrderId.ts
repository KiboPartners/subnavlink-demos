export const parseOrderId = (url:string): string => {
  const regex = /\/([^\/?]+)\?/

  const match = url.match(regex)

  if(match && match[1]){
    return match[1]
  } else {
    return ''
  }
}