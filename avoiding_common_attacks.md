# Avoiding common attacks

## SWC-116 - Block values as a proxy for time

CWE-829: Inclusion of Functionality from Untrusted Control Sphere

**Consideration**: The `block.timestamp` is saved along with information about vehicle manufacturing process, service and police department logs entries. In designed system no decisions are made based on timestamp, and in real world people have to enter information manually (so 15 sec deviation is not critical). Even more usually people would even discard *time* completely from *timestamp* as date is main indicator of service and police records. Thus it is save to use `block.timestamp` as a source of time.

## SWC-103 - Floating Pragma

CWE-664: Improper Control of a Resource Through its Lifetime

**Remediation**: Compiler version is pinned to latest available version of compiler for all smart contracts.

## SWC-100 - Function Default Visibility

CWE-710: Improper Adherence to Coding Standards.

**Remediation**: All functions have explicitly defined visibility.
