const createRegistry = `
  INSERT INTO
    registry
  SET ?;
`

export default {
  createRegistry: createRegistry,
}