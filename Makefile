PACKET_MANAGER	?= bun # yarn, npm, bun
MANAGER_RUN		:= ${PACKET_MANAGER} run
NEST_CLI		:= nest

BUILD_DIR		:= dist
COVERAGE_DIR	:= coverage

QUIET			:= @

.PHONY: install format generate test clean dev build start
.DEFAULT_GOAL 	:= dev

install:
	$(QUIET) echo "Installing dependencies"
	$(QUIET) $(PACKET_MANAGER) install

format:
	$(QUIET) echo "Running formatter"
	$(MANAGER_RUN) format

generate:
ifndef name
	$(error "name" variabl if not set. Usage: make generate name=module-name)
endif
	$(QUIET) $(NEST_CLI) generate module $(name) --no-spec
	$(QUIET) $(NEST_CLI) generate service $(name) --no-spec
	$(QUIET) $(NEST_CLI) generate controller $(name) --no-spec

test: install format
	$(QUIET) echo "Running tests in project"
	$(MANAGER_RUN) test --coverage --out=$(COVERAGE_DIR)

clean:
	$(QUIET) echo "Cleaning up"
	$(QUIET) rm -rf $(BUILD_DIR) $(COVERAGE_DIR)

dev: install format
	$(QUIET) echo "Starting dev server..."
	$(MANAGER_RUN) start:dev

build: install format
	$(QUIET) echo "Building project"
	$(MANAGER_RUN) build --outdir $(BUILD_DIR)

start: install format
	$(QUIET) echo "Starting production server"
	$(MANAGER_RUN) start