const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const USER_ID = 'RudranilDutta_18062005'
const EMAIL_ID = 'rd1342@srmist.edu.in'
const ROLL = 'RA2311003012264'


const VALID = /^([A-Z])->([A-Z])$/

function analyze(input) {
  const invalid_entries = []
  const duplicateSet = new Set()
  const seen = new Set()
  const edges = []

  for (let item of input) {
    const s = String(item).trim()
    const match = s.match(VALID)

    if (!match || match[1] === match[2]) {
      invalid_entries.push(item)
      continue
    }

    if (seen.has(s)) {
      duplicateSet.add(s)
      continue
    }

    seen.add(s)
    edges.push([match[1], match[2]])
  }

  const duplicate_edges = [...duplicateSet]

  const graph = new Map()
  const parent = new Map()
  const nodes = new Set()

  for (let [p, c] of edges) {
    nodes.add(p)
    nodes.add(c)

    if (parent.has(c)) continue

    parent.set(c, p)

    if (!graph.has(p)) graph.set(p, [])
    graph.get(p).push(c)
  }

  function hasCycle(node, visited = new Set(), stack = new Set()) {
    if (!visited.has(node)) {
      visited.add(node)
      stack.add(node)

      for (let child of (graph.get(node) || [])) {
        if (!visited.has(child) && hasCycle(child, visited, stack)) {
          return true
        } else if (stack.has(child)) {
          return true
        }
      }
    }
    stack.delete(node)
    return false
  }

  function buildTree(node) {
    const obj = {}
    for (let child of (graph.get(node) || [])) {
      obj[child] = buildTree(child)
    }
    return obj
  }


  function getDepth(node) {
    const children = graph.get(node) || []
    if (children.length === 0) return 1
    return 1 + Math.max(...children.map(getDepth))
  }

  const visited = new Set()
  const hierarchies = []

  for (let node of nodes) {
    if (visited.has(node)) continue

    const comp = new Set()
    const stack = [node]


    while (stack.length) {
      const curr = stack.pop()
      if (comp.has(curr)) continue

      comp.add(curr)

      for (let child of (graph.get(curr) || [])) stack.push(child)
      if (parent.has(curr)) stack.push(parent.get(curr))
    }

    comp.forEach(n => visited.add(n))

    const cycle = [...comp].some(n => hasCycle(n))

    const roots = [...comp].filter(n => !parent.has(n) || !comp.has(parent.get(n)))
    const root = roots.length ? roots.sort()[0] : [...comp].sort()[0]

    if (cycle) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      })
    } else {
      hierarchies.push({
        root,
        tree: { [root]: buildTree(root) },
        depth: getDepth(root)
      })
    }
  }

  hierarchies.sort((a, b) => {
    if (!!a.has_cycle !== !!b.has_cycle) return a.has_cycle ? 1 : -1
    return a.root.localeCompare(b.root)
  })

  const trees = hierarchies.filter(h => !h.has_cycle)
  const cycles = hierarchies.filter(h => h.has_cycle)

  let largest_tree_root = ''
  if (trees.length) {
    trees.sort((a, b) => b.depth - a.depth || a.root.localeCompare(b.root))
    largest_tree_root = trees[0].root
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: ROLL,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees: trees.length,
      total_cycles: cycles.length,
      largest_tree_root
    }
  }
}

app.post('/bfhl', (req, res) => {
  if (!Array.isArray(req.body.data)) {
    return res.status(400).json({ error: "data must be an array" })
  }

  try {
    const result = analyze(req.body.data)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})


app.get('/', (req, res) => {
  res.json({
    status: "BFHL API running 🚀",
    endpoint: "/bfhl",
    method: "POST"
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))