<?php
include_once '../includes/db.php';
$pdo = getPDOConnection();
include '../includes/user_functions.php';
include '../includes/auth.php';


if (!isAuthenticated() || isAdmin()) {
    exit; // Stop execution if the user is not authorized
}

$projectsWithTasks = getUserProjectsWithTasks();
$statuses = ['Pending' => 'To Do', 'In Progress' => 'In Progress', 'Waiting for Approval' => 'Waiting for Approval', 'Completed' => 'Completed'];

$hasTasks = false; // Flag to check if any task exists
$tasksWithDisplayedSubtasks = []; // Track tasks whose subtasks are displayed

// Check if there are any tasks
foreach ($projectsWithTasks as $projectData) {
    if (!empty($projectData['tasks'])) {
        foreach ($projectData['tasks'] as $task) {
            if (!empty($task['subtasks']) || in_array($task['status'], array_keys($statuses))) {
                $hasTasks = true;
            }
            // Loop through subtasks to track which parent tasks have displayed subtasks
            foreach ($task['subtasks'] as $subtask) {
                if (in_array($subtask['status'], array_keys($statuses))) {
                    $tasksWithDisplayedSubtasks[$task['id']] = true;
                }
            }
        }
    }
}

// If no tasks exist, display a message and exit
if (!$hasTasks) {
    echo "<p class='no-tasks'>No tasks available yet</p>";
    exit;
}

?>
<script src="js/task_columns.js"></script>
<div class="task-columns">
    <?php foreach ($statuses as $dbStatus => $displayStatus): ?>
        <div class="task-column"  data-status="<?php echo $dbStatus; ?>">
            <h4><?php echo $displayStatus; ?></h4>
            <div class="task-column-content">
                <?php foreach ($projectsWithTasks as $projectData):
                    $tasks = $projectData['tasks'];
                    foreach ($tasks as $task):
                        $subtasks = $task['subtasks'];
                        $hasDisplayedSubtasks = false;

                        if (!empty($subtasks)):
                            foreach ($subtasks as $subtask):
                                if ($subtask['status'] == $dbStatus):
                                    $hasDisplayedSubtasks = true;
                                    ?>
                                    <div class="task-card subtask" data-subtask-id="<?php echo $subtask['id']; ?>" data-task-type="subtask" onclick="openDetailedPage('subtask', <?php echo $subtask['id']; ?>)">
                                    <?php if ($subtask['is_reassigned'] == 1): ?>
                                            <span class="label-reassigned">Reassigned</span>
                                        <?php endif; ?>    
                                    <h5><?php echo htmlspecialchars($subtask['name']); ?></h5>
                                        <p><strong>Main Task:</strong> <?php echo htmlspecialchars($task['name']); ?></p>
                                        <p><strong>Deadline:</strong> <?php echo formatDateTime($task['deadline']); ?></p>
                                        <p><strong>Project:</strong> <?php echo htmlspecialchars($subtask['project_name']); ?></p>
                                    </div>
                                    <?php
                                endif;
                            endforeach;
                        endif;

                        // Only display the parent task if no subtasks are displayed anywhere
                        if (!$hasDisplayedSubtasks && $task['status'] == $dbStatus && !isset($tasksWithDisplayedSubtasks[$task['id']])) :
                            ?>
                            <div class="task-card" data-task-id="<?php echo $task['id']; ?>" data-task-type="task" onclick="openDetailedPage('task', <?php echo $task['id']; ?>)">
                            <?php if ($task['is_reassigned'] == 1): ?>
                                    <span class="label-reassigned">Reassigned</span>
                                <?php endif; ?>    
                            <h5><?php echo htmlspecialchars($task['name']); ?></h5>
                                <p><strong>Deadline:</strong> <?php echo formatDateTime($task['deadline']); ?></p>
                                <p><strong>Project:</strong> <?php  echo htmlspecialchars($task['project_name']);?></p>
                            </div>
                            <?php
                        endif;
                    endforeach;
                endforeach;
                ?>
            </div>
        </div>
    <?php endforeach; ?>
</div>
