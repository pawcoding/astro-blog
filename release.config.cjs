const branches = [
  "master",
  { name: "staging", channel: "next", prerelease: true },
];

// Check if the current branch is a release branch
const branch = process.env.GITHUB_REF_NAME;
console.info(`Current branch: ${branch}`);
const isRelease = branches.some(
  (b) => b === branch || (b.name === branch && !b.prerelease),
);

// Assets to update on release
const assetsToUpdate = ["README.md", "package.json", "pnpm-lock.yaml"];

// Add changelog to assets if it's a production release
if (isRelease) {
  assetsToUpdate.push("CHANGELOG.md");
}

const config = {
  branches,
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [
          { breaking: true, release: "major" },
          { type: "docs", scope: "README", release: "patch" },
          { type: "refactor", release: "patch" },
          { type: "build", scope: "deps", release: "patch" },
          { type: "style", release: "patch" },
          { type: "perf", release: "patch" },
        ],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular",
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
        writerOpts: {
          commitsSort: ["subject", "scope"],
        },
      },
    ],
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "pnpm build && pnpm run update-blog-list",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: assetsToUpdate,
      },
    ],
    "@semantic-release/github",
  ],
};

module.exports = config;
