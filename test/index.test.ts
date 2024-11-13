import { describe, expect, it } from "vitest"
import { visitObject } from "../src"

describe("visitObject", () => {
  it("should navigate through object properties using string keys", () => {
    const obj = {
      a: {
        b: {
          c: "value"
        }
      }
    }
    const args = ["a", "b", "c"]
    expect(visitObject(obj, args)).toBe("value")
  })

  it("should handle functions with arguments", () => {
    const obj = {
      a: {
        b: {
          prop: "123",
          c(arg1, arg2) {
            return `${arg1} ${arg2} ${this.prop}`
          }
        }
      }
    }
    const args = ["a", "b", { name: "c", args: ["hello", "world"] }]
    expect(visitObject(obj, args)).toBe("hello world 123")
  })

  it("should return an empty string if any part of the path is undefined", () => {
    const obj = { a: { b: { c: "value" } } }
    const args = ["a", "b", "d"] // 'd' is not defined
    expect(visitObject(obj, args)).toBe("")
  })
})
